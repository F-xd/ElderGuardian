package com.example.elderguardiancore.service;

import com.example.elderguardiancore.dao.DeviceDao;
import com.example.elderguardiancore.mapper.DeviceMapper;
import com.example.elderguardiancore.pojo.dto.DeviceDTO;
import com.example.elderguardiancore.pojo.entity.Device;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.response.PageRes;
import com.example.elderguardiancore.service.interfaces.IDeviceService;
import com.example.elderguardiancore.utils.ConditionUtils;
import com.example.elderguardiancore.utils.PageableUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceService implements IDeviceService {
    @Autowired
    private DeviceDao deviceDao;
    @Autowired
    private DeviceMapper deviceMapper;

    @Override
    public Long updateDeviceData(Device device) {
        // 检查设备是否已存在
        boolean exists = deviceDao.existsDeviceByDeviceName(device.getDeviceName());
        Long deviceId = null;
        if (exists) {
            // 更新设备数据
            Device existingDevice = deviceDao.findDeviceByDeviceName(device.getDeviceName());
            // 比较时间字段，只有时间更新时才更新数据
            if (existingDevice.getTime() < device.getTime()) {
                existingDevice.setDeviceData(device);
            }
            deviceId = deviceDao.save(existingDevice).getDeviceId();
        } else {
            // 添加设备
            deviceId = deviceDao.save(device).getDeviceId();
        }
        return deviceId;
    }

    @Override
    public ResponseMessage<PageRes<DeviceDTO>> getDeviceList(PageReq pageReq) {
        // 从请求参数中提取条件
        Pageable pageable = PageableUtils.createPageable(pageReq);
        ConditionUtils conditionUtils = new ConditionUtils(pageReq.getCondition());

        // 构建查询条件
        String deviceName = conditionUtils.getString("deviceName");

        // 调用 dao 层方法进行条件查询
        Page<Device> devices = deviceDao.findByConditions(
                deviceName,
                pageable);
        List<DeviceDTO> deviceDTOS = deviceMapper.toDTOList(devices.getContent());
        PageRes<DeviceDTO> pageRes = new PageRes<>(devices, deviceDTOS);
        return ResponseMessage.success(pageRes);
    }

    @Override
    public ResponseMessage<List<DeviceDTO>> getAllDevice() {
        List<Device> devices = deviceDao.findAll();
        List<DeviceDTO> deviceDTOS = deviceMapper.toDTOList(devices);
        return ResponseMessage.success(deviceDTOS);
    }
}
