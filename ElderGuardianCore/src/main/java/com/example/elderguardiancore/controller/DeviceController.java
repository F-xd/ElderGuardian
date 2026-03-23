package com.example.elderguardiancore.controller;

import com.example.elderguardiancore.pojo.dto.DeviceDTO;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.response.PageRes;
import com.example.elderguardiancore.service.interfaces.IDeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController // 接口方法返回对象 ，默认返回JSON格式
@RequestMapping("/device") // localhost:8080/room/**
public class DeviceController {
    @Autowired
    IDeviceService deviceService;

    @PostMapping("/list")
    public ResponseMessage<PageRes<DeviceDTO>> getDeviceList(@RequestBody PageReq pageReq) {
        return deviceService.getDeviceList(pageReq);
    }

    @GetMapping("/getAllDevice")
    public ResponseMessage<List<DeviceDTO>> getAllDevice() {
        return deviceService.getAllDevice();
    }

}