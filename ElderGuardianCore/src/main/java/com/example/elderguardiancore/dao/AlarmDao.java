package com.example.elderguardiancore.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.elderguardiancore.pojo.entity.Alarm;
import com.example.elderguardiancore.pojo.entity.Room;
import com.example.elderguardiancore.pojo.entity.User;
import com.example.elderguardiancore.pojo.enums.AlarmEvent;
import com.example.elderguardiancore.pojo.enums.AlarmStatus;
import com.example.elderguardiancore.pojo.enums.AlarmType;

public interface AlarmDao extends JpaRepository<Alarm, Long> {
        Alarm findByRoomAndAlarmEventAndAlarmStatus(Room room, AlarmEvent alarmEvent, AlarmStatus alarmStatus);

        Alarm findByElderAndAlarmEventAndAlarmStatus(User elder, AlarmEvent alarmEvent, AlarmStatus alarmStatus);

        // 分页查询警报列表
        @Query("SELECT d FROM Alarm d WHERE " +
                        "(:alarmType IS NULL OR d.alarmType = :alarmType) AND " +
                        "(:alarmEvent IS NULL OR d.alarmEvent = :alarmEvent) AND " +
                        "(:alarmStatus IS NULL OR d.alarmStatus = :alarmStatus) AND " +
                        "(:id IS NULL OR d.id = :id)")
        Page<Alarm> findByConditions(
                        @Param("alarmType") AlarmType alarmType,
                        @Param("alarmEvent") AlarmEvent alarmEvent,
                        @Param("alarmStatus") AlarmStatus alarmStatus,
                        @Param("id") Long id,
                        Pageable pageable);

        List<Alarm> findByAlarmStatus(AlarmStatus unprocessed);

}
