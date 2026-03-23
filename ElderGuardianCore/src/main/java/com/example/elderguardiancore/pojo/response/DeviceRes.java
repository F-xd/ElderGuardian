package com.example.elderguardiancore.pojo.response;

import com.example.elderguardiancore.pojo.entity.Device;
import com.example.elderguardiancore.pojo.entity.Room;

public class DeviceRes extends Device {
    Room room;

    @Override
    public Room getRoom() {
        return room;
    }

    @Override
    public void setRoom(Room room) {
        this.room = room;
    }
}
