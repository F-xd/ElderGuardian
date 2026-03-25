package com.example.elderguardiancore.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.elderguardiancore.pojo.entity.Alarm;
import com.example.elderguardiancore.pojo.entity.Room;
import com.example.elderguardiancore.pojo.entity.User;
import com.example.elderguardiancore.pojo.enums.AlarmEvent;
import com.example.elderguardiancore.pojo.enums.AlarmStatus;

public interface AlarmDao extends JpaRepository<Alarm, Integer> {
    Alarm findByRoomAndAlarmEventAndAlarmStatus(Room room, AlarmEvent alarmEvent, AlarmStatus alarmStatus);

    Alarm findByElderAndAlarmEventAndAlarmStatus(User elder, AlarmEvent alarmEvent, AlarmStatus alarmStatus);
}
