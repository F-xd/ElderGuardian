package com.example.elderguardiancore.pojo.dto;

import com.example.elderguardiancore.pojo.entity.EnvironmentData;
import com.example.elderguardiancore.pojo.entity.HealthData;
import com.example.elderguardiancore.pojo.entity.Room;
import com.example.elderguardiancore.pojo.enums.AlarmEvent;
import com.example.elderguardiancore.pojo.enums.AlarmStatus;
import com.example.elderguardiancore.pojo.enums.AlarmType;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class AlarmDTO {
    // 主键ID
    private Long id;

    // 警报类型
    private AlarmType alarmType;

    // 警报事件
    private AlarmEvent alarmEvent;

    // 房间警报时关联的房间
    private RoomSummaryDTO room;

    // 健康警报关联的老人
    private UserSummaryDTO elder;

    // 房间报警时关联的环境传感器数据
    private EnvironmentData environmentData;

    // 健康报警时关联的健康传感器数据
    private HealthData healthData;

    // 警报状态
    private AlarmStatus alarmStatus;

    // 处理原因/措施
    private String handleReason;

    // 处理时间（时间戳）
    private Long handleTime;

    // 处理人
    private UserSummaryDTO handleUser;

    // 报警时间（时间戳）
    private Long triggerTime;

    public AlarmDTO() {
    }

    public AlarmDTO(Long id, AlarmType alarmType, AlarmEvent alarmEvent, RoomSummaryDTO room, UserSummaryDTO elder,
            EnvironmentData environmentData, HealthData healthData, AlarmStatus alarmStatus, String handleReason,
            Long handleTime, UserSummaryDTO handleUser, Long triggerTime) {
        this.id = id;
        this.alarmType = alarmType;
        this.alarmEvent = alarmEvent;
        this.room = room;
        this.elder = elder;
        this.environmentData = environmentData;
        this.healthData = healthData;
        this.alarmStatus = alarmStatus;
        this.handleReason = handleReason;
        this.handleTime = handleTime;
        this.handleUser = handleUser;
        this.triggerTime = triggerTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AlarmType getAlarmType() {
        return alarmType;
    }

    public void setAlarmType(AlarmType alarmType) {
        this.alarmType = alarmType;
    }

    public AlarmEvent getAlarmEvent() {
        return alarmEvent;
    }

    public void setAlarmEvent(AlarmEvent alarmEvent) {
        this.alarmEvent = alarmEvent;
    }

    public RoomSummaryDTO getRoom() {
        return room;
    }

    public void setRoom(RoomSummaryDTO room) {
        this.room = room;
    }

    public UserSummaryDTO getElder() {
        return elder;
    }

    public void setElder(UserSummaryDTO elder) {
        this.elder = elder;
    }

    public EnvironmentData getEnvironmentData() {
        return environmentData;
    }

    public void setEnvironmentData(EnvironmentData environmentData) {
        this.environmentData = environmentData;
    }

    public HealthData getHealthData() {
        return healthData;
    }

    public void setHealthData(HealthData healthData) {
        this.healthData = healthData;
    }

    public AlarmStatus getAlarmStatus() {
        return alarmStatus;
    }

    public void setAlarmStatus(AlarmStatus alarmStatus) {
        this.alarmStatus = alarmStatus;
    }

    public String getHandleReason() {
        return handleReason;
    }

    public void setHandleReason(String handleReason) {
        this.handleReason = handleReason;
    }

    public Long getHandleTime() {
        return handleTime;
    }

    public void setHandleTime(Long handleTime) {
        this.handleTime = handleTime;
    }

    public UserSummaryDTO getHandleUser() {
        return handleUser;
    }

    public void setHandleUser(UserSummaryDTO handleUser) {
        this.handleUser = handleUser;
    }

    public Long getTriggerTime() {
        return triggerTime;
    }

    public void setTriggerTime(Long triggerTime) {
        this.triggerTime = triggerTime;
    }

}
