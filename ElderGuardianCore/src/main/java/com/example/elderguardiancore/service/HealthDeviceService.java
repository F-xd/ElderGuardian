package com.example.elderguardiancore.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.elderguardiancore.dao.HealthDeviceDao;
import com.example.elderguardiancore.mapper.HealthDeviceMapper;
import com.example.elderguardiancore.pojo.dto.DeviceDTO;
import com.example.elderguardiancore.pojo.dto.HealthDeviceDTO;
import com.example.elderguardiancore.pojo.entity.Device;
import com.example.elderguardiancore.pojo.entity.HealthDevice;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.response.PageRes;
import com.example.elderguardiancore.service.interfaces.IHealthDeviceService;
import com.example.elderguardiancore.utils.ConditionUtils;
import com.example.elderguardiancore.utils.PageableUtils;

@Service
public class HealthDeviceService implements IHealthDeviceService {
    @Autowired
    private HealthDeviceDao healthDeviceDao;
    @Autowired
    private HealthDeviceMapper healthDeviceMapper;

    @Override
    public HealthDevice updateHealthDevice(HealthDevice healthDevice) {
        // 检查设备是否已存在
        boolean exists = healthDeviceDao.existsHealthDeviceByDeviceName(healthDevice.getDeviceName());
        HealthDevice device = null;
        if (exists) {
            // 更新设备数据
            HealthDevice existingDevice = healthDeviceDao.findHealthDeviceByDeviceName(healthDevice.getDeviceName());
            // 比较时间字段，只有时间更新时才更新数据
            if (existingDevice.getTime() < healthDevice.getTime()) {
                existingDevice.setHealthDeviceData(healthDevice);
            }
            device = healthDeviceDao.save(existingDevice);

        } else {
            // 添加设备
            device = healthDeviceDao.save(healthDevice);
        }
        return device;
    }

    @Override
    public ResponseMessage<List<HealthDeviceDTO>> getAllHealthDevice() {
        List<HealthDevice> healthDevices = healthDeviceDao.findAll();
        List<HealthDeviceDTO> healthDeviceDTOs = healthDeviceMapper.toDTOList(healthDevices);
        return ResponseMessage.success(healthDeviceDTOs);
    }

    @Override
    public ResponseMessage<PageRes<HealthDeviceDTO>> getHealthDeviceList(PageReq pageReq) {
        // 从请求参数中提取条件
        Pageable pageable = PageableUtils.createPageable(pageReq);
        ConditionUtils conditionUtils = new ConditionUtils(pageReq.getCondition());

        // 构建查询条件
        String deviceName = conditionUtils.getString("deviceName");

        // 调用 dao 层方法进行条件查询
        Page<HealthDevice> healthDevices = healthDeviceDao.findByConditions(
                deviceName,
                pageable);
        List<HealthDeviceDTO> healthDeviceDTOS = healthDeviceMapper.toDTOList(healthDevices.getContent());
        PageRes<HealthDeviceDTO> pageRes = new PageRes<>(healthDevices, healthDeviceDTOS);
        return ResponseMessage.success(pageRes);
    }
}
