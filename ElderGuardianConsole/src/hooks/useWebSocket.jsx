import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

const useWebSocket = ({ onMessage, onConnect, onDisconnect }) => {
  const user = useSelector((state) => state.user);
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connectWebSocket = () => {
    const wsUrl = `ws://192.168.50.219:8080/ws`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("WebSocket连接已建立");
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      if (onConnect) onConnect();
      console.log(user);
      if (user && user.userId) {
        websocket.send(
          JSON.stringify({
            type: "login",
            userId: user.userId,
          }),
        );
      }
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (error) {
        console.error("解析WebSocket消息失败:", error);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket错误:", error);
    };

    websocket.onclose = (event) => {
      console.log("WebSocket连接已关闭:", event.code, event.reason);
      setIsConnected(false);
      if (onDisconnect) onDisconnect();

      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttemptsRef.current),
          30000,
        );
        console.log(
          `尝试重连WebSocket (${reconnectAttemptsRef.current}/${maxReconnectAttempts})，${delay}ms后重试`,
        );

        reconnectTimerRef.current = setTimeout(() => {
          connectWebSocket();
        }, delay);
      }
    };

    setWs(websocket);
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (ws) {
        ws.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ws && ws.readyState === WebSocket.OPEN && user && user.userId) {
      ws.send(
        JSON.stringify({
          type: "login",
          userId: user.userId,
        }),
      );
      console.log("重新发送登录消息:");
    }
  }, [user, ws]);

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    } else {
      console.error("WebSocket未连接，无法发送消息");
      return false;
    }
  };

  const disconnect = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    if (ws) {
      ws.close();
    }
    setIsConnected(false);
  };

  const reconnect = () => {
    if (ws) {
      ws.close();
    }
    reconnectAttemptsRef.current = 0;
    connectWebSocket();
  };

  return {
    isConnected,
    sendMessage,
    disconnect,
    reconnect,
  };
};

export default useWebSocket;
