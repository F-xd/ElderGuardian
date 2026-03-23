package com.example.elderguardiancore.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elderguardiancore.pojo.dto.HealthDeviceDTO;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.response.PageRes;
import com.example.elderguardiancore.service.interfaces.IHealthDeviceService;

@RestController
@RequestMapping("/healthDevice")
public class HealthDeviceController {
    @Autowired
    IHealthDeviceService healthDeviceService;

    @GetMapping("/getAllHealthDevice")
    public ResponseMessage<List<HealthDeviceDTO>> getAllHealthDevice() {
        return healthDeviceService.getAllHealthDevice();
    }

    @PostMapping("/list")
    public ResponseMessage<PageRes<HealthDeviceDTO>> getHealthDeviceList(@RequestBody PageReq pageReq) {
        return healthDeviceService.getHealthDeviceList(pageReq);
    }
}
