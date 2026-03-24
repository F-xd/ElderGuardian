package com.example.elderguardiancore.pojo.response;

import java.util.ArrayList;
import java.util.List;

import com.example.elderguardiancore.pojo.dto.DeviceSummaryDTO;
import com.example.elderguardiancore.pojo.dto.UserDTO;
import com.example.elderguardiancore.pojo.entity.HealthData;
import com.example.elderguardiancore.pojo.entity.User;

public class ElderHealthRes extends UserDTO {
    private DeviceSummaryDTO roomDevice;
    private List<HealthData> healthDatas;

    public ElderHealthRes() {
        super();
        this.healthDatas = new ArrayList<>();
    }

    public ElderHealthRes(User user) {
        super(user);
        this.healthDatas = new ArrayList<>();
    }

    public DeviceSummaryDTO getRoomDevice() {
        return roomDevice;
    }

    public void setRoomDevice(DeviceSummaryDTO roomDevice) {
        this.roomDevice = roomDevice;
    }

    public List<HealthData> getHealthDatas() {
        return healthDatas;
    }

    public void setHealthDatas(List<HealthData> healthDatas) {
        this.healthDatas = healthDatas;
    }

}
