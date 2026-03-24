package com.example.elderguardiancore.pojo.dto;

/**
 * Device摘要数据传输对象，用于避免循环引用
 */
public class DeviceSummaryDTO {
    // 设备ID
    private Long deviceId;

    // 设备名称
    private String deviceName;

    // 传感器数据采集时间
    private Long time;

    // 温度
    private Integer temperature;

    // 湿度
    private Integer humidity;

    // 气体浓度
    private Integer gasConcentration;

    // 构造方法
    public DeviceSummaryDTO() {
    }

    public DeviceSummaryDTO(Long deviceId, String deviceName, Long time, Integer temperature, Integer humidity,
            Integer gasConcentration) {
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.time = time;
        this.temperature = temperature;
        this.humidity = humidity;
        this.gasConcentration = gasConcentration;
    }

    // 从实体转换为DTO的构造方法
    public DeviceSummaryDTO(com.example.elderguardiancore.pojo.entity.Device device) {
        this.deviceId = device.getDeviceId();
        this.deviceName = device.getDeviceName();
        this.time = device.getTime();
        this.temperature = device.getTemperature();
        this.humidity = device.getHumidity();
        this.gasConcentration = device.getGasConcentration();
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

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public Integer getTemperature() {
        return temperature;
    }

    public void setTemperature(Integer temperature) {
        this.temperature = temperature;
    }

    public Integer getHumidity() {
        return humidity;
    }

    public void setHumidity(Integer humidity) {
        this.humidity = humidity;
    }

    public Integer getGasConcentration() {
        return gasConcentration;
    }

    public void setGasConcentration(Integer gasConcentration) {
        this.gasConcentration = gasConcentration;
    }

}