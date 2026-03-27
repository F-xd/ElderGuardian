package com.example.elderguardiancore.service.interfaces;

import com.example.elderguardiancore.pojo.dto.DeviceDTO;
import com.example.elderguardiancore.pojo.entity.Device;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.response.PageRes;

import java.util.List;

public interface IDeviceService {
    /**
     * 更新设备数据
     * 
     * @param device
     * @return 设备ID
     */
    Long updateDeviceData(Device device);

    /**
     * 查询设备列表
     * 
     * @param pageReq 分页请求对象
     * @return 设备列表分页响应对象
     */
    ResponseMessage<PageRes<DeviceDTO>> getDeviceList(PageReq pageReq);

    /**
     * 获取所有设备
     * 
     * @param token   认证令牌
     * @param pageReq 分页请求对象
     * @return 所有设备列表
     */
    ResponseMessage<List<DeviceDTO>> getAllDevice(String token);
}