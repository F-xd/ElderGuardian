package com.example.elderguardiancore.pojo.dto;

import com.example.elderguardiancore.pojo.entity.HealthDevice;

public class HealthDeviceSummaryDTO {
    // 设备ID
    private Long deviceId;
    // 设备名称
    private String deviceName;

    // 传感器数据采集时间
    private Long time;
    // 心率
    private Integer heartRate;

    // 血氧
    private Integer spo2;

    // 是否跌倒
    private Boolean isFallDown;

    // 构造方法
    public HealthDeviceSummaryDTO() {
    }

    public HealthDeviceSummaryDTO(Long deviceId, String deviceName, Long time, Integer heartRate, Integer spo2,
            Boolean isFallDown) {
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.time = time;
        this.heartRate = heartRate;
        this.spo2 = spo2;
        this.isFallDown = isFallDown;
    }

    // 从实体转换为DTO的构造方法
    public HealthDeviceSummaryDTO(HealthDevice healthDevice) {
        this.deviceId = healthDevice.getDeviceId();
        this.deviceName = healthDevice.getDeviceName();
        this.heartRate = healthDevice.getHeartRate();
        this.spo2 = healthDevice.getSpo2();
        this.isFallDown = healthDevice.getIsFallDown();
        this.time = healthDevice.getTime();
    }

    // Getter和Setter方法
    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public Integer getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(Integer heartRate) {
        this.heartRate = heartRate;
    }

    public Integer getSpo2() {
        return spo2;
    }

    public void setSpo2(Integer spo2) {
        this.spo2 = spo2;
    }

    public Boolean getIsFallDown() {
        return isFallDown;
    }

    public void setIsFallDown(Boolean isFallDown) {
        this.isFallDown = isFallDown;
    }

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }
}
