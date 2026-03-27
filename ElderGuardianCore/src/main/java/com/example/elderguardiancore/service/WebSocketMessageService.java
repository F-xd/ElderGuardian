package com.example.elderguardiancore.service;

import com.example.elderguardiancore.dao.UserDao;
import com.example.elderguardiancore.mapper.AlarmMapper;
import com.example.elderguardiancore.pojo.entity.Alarm;
import com.example.elderguardiancore.pojo.entity.Room;
import com.example.elderguardiancore.pojo.entity.User;
import com.example.elderguardiancore.pojo.enums.AlarmType;
import com.example.elderguardiancore.pojo.enums.Role;
import com.example.elderguardiancore.websocket.WebSocketHandler;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WebSocketMessageService {
    @Autowired
    private UserDao userDao;
    @Autowired
    private AlarmMapper alarmMapper;
    private final WebSocketHandler webSocketHandler;

    public WebSocketMessageService(WebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    public void broadcastAlarm(Object alarmData) {
        webSocketHandler.broadcastMessage(alarmData);
    }

    public void broadcastDeviceStatus(Object deviceStatus) {
        webSocketHandler.broadcastMessage(deviceStatus);
    }

    public void broadcastEnvironmentData(Object environmentData) {
        webSocketHandler.broadcastMessage(environmentData);
    }

    public void broadcastHealthData(Object healthData) {
        webSocketHandler.broadcastMessage(healthData);
    }

    public void sendMessageToClient(String sessionId, Object message) {
        webSocketHandler.sendMessageToClient(sessionId, message);
    }

    public void sendMessageToUser(Long userId, Object message) {
        webSocketHandler.sendMessageToUser(userId, message);
    }

    public void sendAlarmToRelatedUser(Alarm alarm) {
        AlarmType alarmType = alarm.getAlarmType();
        Set<Long> sendUserIds = new HashSet<>();
        // 所有管理员都能收到报警
        List<User> adminUsers = userDao.findAllByRole(Role.ADMIN);
        adminUsers.forEach(user -> {
            sendUserIds.add(user.getUserId());
        });

        // 如果是房间报警
        if (alarmType == AlarmType.ROOM_ALARM) {
            // 找到房间下的所有用户
            Room room = alarm.getRoom();
            if (room != null) {
                List<User> roomUsers = room.getUsers();
                if (roomUsers != null && !roomUsers.isEmpty()) {
                    roomUsers.forEach(user -> {
                        sendUserIds.add(user.getUserId());
                        // 家属和护理人都能收到报警信息
                        sendUserIds.addAll(user.getFamilyIds());
                        sendUserIds.addAll(user.getCaregiverIds());
                    });
                }
            }
        }
        // 如果是健康报警
        if (alarmType == AlarmType.HEALTH_ALARM) {
            // 找到健康报警的用户
            User elderUser = alarm.getElder();
            if (elderUser != null) {
                sendUserIds.add(elderUser.getUserId());
                // 家属和护理人都能收到报警信息
                sendUserIds.addAll(elderUser.getFamilyIds());
                sendUserIds.addAll(elderUser.getCaregiverIds());
            }
        }
        for (Long userId : sendUserIds) {
            webSocketHandler.sendMessageToUser(userId, alarmMapper.toDTO(alarm));
        }
        return;
    }

    public boolean isUserOnline(Long userId) {
        return webSocketHandler.isUserOnline(userId);
    }

    public int getOnlineUserCount() {
        return webSocketHandler.getOnlineUserCount();
    }
}
