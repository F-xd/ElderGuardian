package com.example.elderguardiancore.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<Long, String> userIdToSessionId = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, Long> sessionIdToUserId = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String sessionId = session.getId();
        sessions.put(sessionId, session);
        System.out.println("WebSocket连接建立: " + sessionId);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("收到消息: " + payload);

        try {
            com.fasterxml.jackson.databind.JsonNode jsonNode = objectMapper.readTree(payload);
            if (jsonNode.has("type") && "login".equals(jsonNode.get("type").asText())) {
                if (jsonNode.has("userId")) {
                    Long userId = jsonNode.get("userId").asLong();
                    String sessionId = session.getId();
                    if (userIdToSessionId.containsKey(userId)) {
                        String oldSessionId = userIdToSessionId.get(userId);
                        sessionIdToUserId.remove(oldSessionId);
                    }
                    userIdToSessionId.put(userId, sessionId);
                    sessionIdToUserId.put(sessionId, userId);
                    System.out.println("用户登录: userId=" + userId + ", sessionId=" + sessionId);
                }
            }
        } catch (Exception e) {
            System.err.println("解析消息失败: " + e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String sessionId = session.getId();
        sessions.remove(sessionId);

        if (sessionIdToUserId.containsKey(sessionId)) {
            Long userId = sessionIdToUserId.get(sessionId);
            userIdToSessionId.remove(userId);
            sessionIdToUserId.remove(sessionId);
            System.out.println("用户断开连接: userId=" + userId);
        }

        System.out.println("WebSocket连接关闭: " + sessionId);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.out.println("WebSocket传输错误: " + exception.getMessage());
        if (session.isOpen()) {
            session.close();
        }
    }

    public void broadcastMessage(Object message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            sessions.forEach((sessionId, session) -> {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(new TextMessage(jsonMessage));
                    } catch (IOException e) {
                        System.err.println("发送消息失败: " + e.getMessage());
                    }
                }
            });
        } catch (Exception e) {
            System.err.println("序列化消息失败: " + e.getMessage());
        }
    }

    public void sendMessageToClient(String sessionId, Object message) {
        WebSocketSession session = sessions.get(sessionId);
        if (session != null && session.isOpen()) {
            try {
                String jsonMessage = objectMapper.writeValueAsString(message);
                session.sendMessage(new TextMessage(jsonMessage));
            } catch (Exception e) {
                System.err.println("发送消息失败: " + e.getMessage());
            }
        }
    }

    public void sendMessageToUser(Long userId, Object message) {
        String sessionId = userIdToSessionId.get(userId);
        if (sessionId != null) {
            sendMessageToClient(sessionId, message);
        } else {
            System.out.println("用户未在线: userId=" + userId);
        }
    }

    public boolean isUserOnline(Long userId) {
        return userIdToSessionId.containsKey(userId);
    }

    public int getOnlineUserCount() {
        return userIdToSessionId.size();
    }
}
