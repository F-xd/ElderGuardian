package com.example.elderguardiancore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.elderguardiancore.dao.AlarmDao;
import com.example.elderguardiancore.dao.HealthDataDao;
import com.example.elderguardiancore.dao.HealthDeviceDao;
import com.example.elderguardiancore.pojo.entity.Alarm;
import com.example.elderguardiancore.pojo.entity.HealthData;
import com.example.elderguardiancore.pojo.entity.HealthDevice;
import com.example.elderguardiancore.pojo.entity.User;
import com.example.elderguardiancore.pojo.enums.AlarmEvent;
import com.example.elderguardiancore.pojo.enums.AlarmStatus;
import com.example.elderguardiancore.pojo.enums.AlarmType;
import com.example.elderguardiancore.service.interfaces.IHealthDataService;

@Service
public class HealthDataService implements IHealthDataService {
    @Autowired
    private HealthDataDao healthDataDao;
    @Autowired
    private AlarmDao alarmDao;
    @Autowired
    private HealthDeviceDao healthDeviceDao;

    public void saveHealthAlarm(AlarmEvent alarmEvent, HealthData healthData) {
        HealthDevice healthDevice = healthDeviceDao.findById(healthData.getDeviceId()).orElse(null);
        User elder = null;
        if (healthDevice != null) {
            elder = healthDevice.getUser();
        }
        // 检查是否存在同一老人、同一事件类型且状态为未处理的警报
        Alarm existingAlarm = alarmDao.findByElderAndAlarmEventAndAlarmStatus(
                elder,
                alarmEvent,
                AlarmStatus.UNPROCESSED);
        if (existingAlarm == null) {
            // 如果不存在未处理的相同类型警报，则创建新警报
            Alarm newAlarm = new Alarm();
            newAlarm.setElder(elder);
            newAlarm.setAlarmType(AlarmType.HEALTH_ALARM);
            newAlarm.setAlarmEvent(alarmEvent);
            newAlarm.setAlarmStatus(AlarmStatus.UNPROCESSED);
            newAlarm.setAlarmTime(healthData.getTime());
            newAlarm.setHealthData(healthData);
            alarmDao.save(newAlarm);
        } else {
            // 如果存在未处理的相同类型警报，则更新警报数据
            existingAlarm.setHealthData(healthData);
            alarmDao.save(existingAlarm);
        }
    }

    @Override
    public void addHealthData(HealthData healthData) {
        // 保存健康数据到数据库
        healthDataDao.save(healthData);
        // 校验健康数据是否触发警报
        Integer heartRate = healthData.getHeartRate();
        Integer spo2 = healthData.getSpo2();
        Boolean isFallDown = healthData.getIsFallDown();

        if (heartRate != null && (heartRate > 100 || heartRate < 60)) {
            saveHealthAlarm(AlarmEvent.HEART_RATE_ABNORMAL, healthData);
        }
        if (spo2 != null && spo2 < 90) {
            saveHealthAlarm(AlarmEvent.BLOOD_OXYGEN_ABNORMAL, healthData);
        }
        if (Boolean.TRUE.equals(isFallDown)) {
            saveHealthAlarm(AlarmEvent.FALL_HELP, healthData);
        }
    }
}
