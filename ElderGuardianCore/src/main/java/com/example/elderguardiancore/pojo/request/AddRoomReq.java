package com.example.elderguardiancore.pojo.request;

import com.example.elderguardiancore.pojo.entity.Room;

public class AddRoomReq extends Room {
    private Long deviceId;

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }
}
