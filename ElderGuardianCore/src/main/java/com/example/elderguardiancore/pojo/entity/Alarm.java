package com.example.elderguardiancore.pojo.entity;

import com.example.elderguardiancore.pojo.enums.AlarmEvent;
import com.example.elderguardiancore.pojo.enums.AlarmStatus;
import com.example.elderguardiancore.pojo.enums.AlarmType;
import jakarta.persistence.*;

@Table(name = "tb_alarm")
@Entity
public class Alarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // 警报类型
    @Column(name = "alarm_type")
    private AlarmType alarmType;

    // 警报事件
    @Column(name = "alarm_event")
    private AlarmEvent alarmEvent;

    // 房间警报时关联的房间
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    // 健康警报关联的老人
    @ManyToOne
    @JoinColumn(name = "elder_id")
    private User elder;

    // 房间报警时关联的环境传感器数据
    @ManyToOne
    @JoinColumn(name = "environment_data_id")
    private EnvironmentData environmentData;

    // 健康报警时关联的健康传感器数据
    @ManyToOne
    @JoinColumn(name = "health_data_id")
    private HealthData healthData;

    // 警报状态
    @Column(name = "alarm_status")
    private AlarmStatus alarmStatus;

    // 处理原因/措施
    @Column(name = "handle_reason")
    private String handleReason;

    // 处理时间（时间戳）
    @Column(name = "handle_time")
    private Long handleTime;

    // 处理人
    @ManyToOne
    @JoinColumn(name = "handle_user_id")
    private User handleUser;

    // 报警时间（时间戳）
    @Column(name = "trigger_time")
    private Long triggerTime;

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

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public User getElder() {
        return elder;
    }

    public void setElder(User elder) {
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

    public User getHandleUser() {
        return handleUser;
    }

    public void setHandleUser(User handleUser) {
        this.handleUser = handleUser;
    }

    public Long getTriggerTime() {
        return triggerTime;
    }

    public void setTriggerTime(Long triggerTime) {
        this.triggerTime = triggerTime;
    }

    @Override
    public String toString() {
        return "Alarm{" +
                "id=" + id +
                ", alarmType=" + alarmType +
                ", alarmEvent=" + alarmEvent +
                ", room=" + room +
                ", elder=" + elder +
                ", environmentData=" + environmentData +
                ", healthData=" + healthData +
                ", alarmStatus=" + alarmStatus +
                ", handleReason='" + handleReason + '\'' +
                ", handleTime=" + handleTime +
                ", handleUser=" + handleUser +
                ", triggerTime=" + triggerTime +
                '}';
    }
}