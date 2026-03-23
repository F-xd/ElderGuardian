package com.example.elderguardiancore.service;

import com.example.elderguardiancore.dao.EnvironmentSensorDao;
import com.example.elderguardiancore.pojo.entity.EnvironmentData;
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

    @Override
    public void addEnvironmentSensor(EnvironmentData environmentData) {
        environmentSensorDao.save(environmentData);
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
