package com.example.elderguardiancore.service;

import com.example.elderguardiancore.dao.AlarmDao;
import com.example.elderguardiancore.dao.DeviceDao;
import com.example.elderguardiancore.dao.EnvironmentSensorDao;
import com.example.elderguardiancore.dao.RoomDao;
import com.example.elderguardiancore.pojo.entity.Alarm;
import com.example.elderguardiancore.pojo.entity.Device;
import com.example.elderguardiancore.pojo.entity.EnvironmentData;
import com.example.elderguardiancore.pojo.entity.Room;
import com.example.elderguardiancore.pojo.enums.AlarmEvent;
import com.example.elderguardiancore.pojo.enums.AlarmStatus;
import com.example.elderguardiancore.pojo.enums.AlarmType;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.service.interfaces.IEnvironmentSensorService;
import com.example.elderguardiancore.utils.ConditionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class EnvironmentSensorService implements IEnvironmentSensorService {
    @Autowired
    private EnvironmentSensorDao environmentSensorDao;
    @Autowired
    private AlarmDao alarmDao;
    @Autowired
    private DeviceDao deviceDao;

    public void saveEnvironmentAlarm(AlarmEvent alarmEvent, EnvironmentData environmentData) {
        Device device = deviceDao.findById(environmentData.getDeviceId()).orElse(null); // 这里需要根据实际情况获取房间
        Room room = null;
        if (device != null) {
            room = device.getRoom();
        }
        // 检查是否存在同一房间、同一事件类型且状态为未处理的警报
        Alarm existingAlarm = alarmDao.findByRoomAndAlarmEventAndAlarmStatus(
                room,
                alarmEvent,
                AlarmStatus.UNPROCESSED);
        if (existingAlarm == null) {
            // 如果不存在未处理的相同类型警报，则创建新警报
            Alarm newAlarm = new Alarm();
            newAlarm.setRoom(room);
            newAlarm.setAlarmType(AlarmType.ROOM_ALARM);
            newAlarm.setAlarmEvent(alarmEvent);
            newAlarm.setAlarmStatus(AlarmStatus.UNPROCESSED);
            newAlarm.setAlarmTime(environmentData.getTime());
            newAlarm.setEnvironmentData(environmentData);
            alarmDao.save(newAlarm);
        } else {
            // 如果存在未处理的相同类型警报，则更新警报数据
            existingAlarm.setEnvironmentData(environmentData);
            alarmDao.save(existingAlarm);
        }
    }

    @Override
    public void addEnvironmentSensor(EnvironmentData environmentData) {
        // 保存环境传感器数据到数据库
        environmentSensorDao.save(environmentData);
        // 校验环境数据是否触发警报
        int temperature = environmentData.getTemperature();
        int humidity = environmentData.getHumidity();
        int gasConcentration = environmentData.getGasConcentration();

        if (temperature > 38) {
            saveEnvironmentAlarm(AlarmEvent.HIGH_TEMPERATURE_WARNING, environmentData);
        }
        if (temperature < 5) {
            saveEnvironmentAlarm(AlarmEvent.LOW_TEMPERATURE_WARNING, environmentData);
        }
        if (humidity > 80) {
            saveEnvironmentAlarm(AlarmEvent.HUMIDITY_WARNING, environmentData);
        }
        if (humidity < 20) {
            saveEnvironmentAlarm(AlarmEvent.DRY_WARNING, environmentData);
        }
        if (gasConcentration > 1000) {
            saveEnvironmentAlarm(AlarmEvent.SMOKE_WARNING, environmentData);
        }
    }

    @Override
    public ResponseMessage<Map<String, Object>> getEnvironmentDataList(PageReq pageReq) {
        // 从请求参数中提取条件
        ConditionUtils conditionUtils = new ConditionUtils(pageReq.getCondition());

        // 构建查询条件
        Long deviceId = conditionUtils.getLong("deviceId");
        long minTime = conditionUtils.getLong("minTime");
        long maxTime = conditionUtils.getLong("maxTime");

        // 调用 dao 层方法进行条件查询
        List<EnvironmentData> environmentDatas = environmentSensorDao.findByConditions(
                deviceId,
                minTime,
                maxTime);
        // 构建响应数据
        return ResponseMessage.success(Map.of("content", environmentDatas));
    }
}
