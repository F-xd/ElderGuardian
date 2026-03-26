package com.example.elderguardiancore.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.elderguardiancore.dao.AlarmDao;
import com.example.elderguardiancore.dao.UserDao;
import com.example.elderguardiancore.mapper.AlarmMapper;
import com.example.elderguardiancore.pojo.dto.AlarmDTO;
import com.example.elderguardiancore.pojo.entity.Alarm;
import com.example.elderguardiancore.pojo.entity.User;
import com.example.elderguardiancore.pojo.enums.AlarmEvent;
import com.example.elderguardiancore.pojo.enums.AlarmStatus;
import com.example.elderguardiancore.pojo.enums.AlarmType;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.response.PageRes;
import com.example.elderguardiancore.service.interfaces.IAlarmService;
import com.example.elderguardiancore.utils.ConditionUtils;
import com.example.elderguardiancore.utils.PageableUtils;

@Service
public class AlarmService implements IAlarmService {
    @Autowired
    AlarmDao alarmDao;
    @Autowired
    AlarmMapper alarmMapper;
    @Autowired
    UserDao userDao;

    @Override
    public ResponseMessage<PageRes<AlarmDTO>> getAlarmList(PageReq pageReq) {
        // 从请求参数中提取条件
        Pageable pageable = PageableUtils.createPageable(pageReq);
        ConditionUtils conditionUtils = new ConditionUtils(pageReq.getCondition());

        // 构建查询条件
        AlarmType alarmType = conditionUtils.getEnum("alarmType", AlarmType.class);
        AlarmEvent alarmEvent = conditionUtils.getEnum("alarmEvent", AlarmEvent.class);
        AlarmStatus alarmStatus = conditionUtils.getEnum("alarmStatus", AlarmStatus.class);
        // 调用 dao 层方法进行条件查询
        Page<Alarm> alarms = alarmDao.findByConditions(
                alarmType,
                alarmEvent,
                alarmStatus,
                pageable);
        List<AlarmDTO> alarmDTOS = alarmMapper.toDTOList(alarms.getContent());
        PageRes<AlarmDTO> pageRes = new PageRes<>(alarms, alarmDTOS);
        return ResponseMessage.success(pageRes);
    }

    @Override
    public ResponseMessage<String> handleAlarm(Alarm alarm, Long handleUserId) {
        Long id = alarm.getId();
        if (id == null) {
            return ResponseMessage.error("处理ID不能为空");
        }
        Alarm existingAlarm = alarmDao.findById(id).orElse(null);
        if (existingAlarm == null) {
            return ResponseMessage.error("警报信息不存在");
        }
        User handleUser = userDao.findById(handleUserId).orElse(null);
        if (handleUser == null) {
            return ResponseMessage.error("处理用户不存在");
        }
        if (existingAlarm.getAlarmEvent() == AlarmEvent.FALL_HELP) {
            // 发送消息到设备取消跌倒报警
            PubService.pubMessage("isFallDown=0", existingAlarm.getHealthData().getDeviceName());
        }
        existingAlarm.setAlarmStatus(AlarmStatus.PROCESSED);
        existingAlarm.setHandleUser(handleUser);
        existingAlarm.setHandleReason(alarm.getHandleReason());
        existingAlarm.setHandleTime(System.currentTimeMillis());
        alarmDao.save(existingAlarm);
        return ResponseMessage.success(null, "处理成功");
    }

}
