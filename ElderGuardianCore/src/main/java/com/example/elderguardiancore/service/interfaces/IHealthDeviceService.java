package com.example.elderguardiancore.service.interfaces;

import java.util.List;

import com.example.elderguardiancore.pojo.dto.HealthDeviceDTO;
import com.example.elderguardiancore.pojo.entity.HealthDevice;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.response.PageRes;

public interface IHealthDeviceService {
    HealthDevice updateHealthDevice(HealthDevice healthDevice);

    /**
     * 获取所有健康设备
     * 
     * @return 所有健康设备列表
     */
    ResponseMessage<List<HealthDeviceDTO>> getAllHealthDevice();

    /**
     * 获取健康设备列表
     * 
     * @param pageReq 分页请求参数
     * @return 健康设备列表
     */
    ResponseMessage<PageRes<HealthDeviceDTO>> getHealthDeviceList(PageReq pageReq);
}
