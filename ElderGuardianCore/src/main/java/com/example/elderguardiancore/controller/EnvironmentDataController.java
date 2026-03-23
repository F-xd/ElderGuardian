package com.example.elderguardiancore.controller;

import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.service.interfaces.IEnvironmentSensorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController // 接口方法返回对象 ，默认返回JSON格式
@RequestMapping("/environmentData") // localhost:8080/room/**
public class EnvironmentDataController {

    @Autowired
    private IEnvironmentSensorService environmentDataService;

    // 环境数据接口
    @PostMapping("/list")
    public ResponseMessage<Map<String, Object>> getEnvironmentDataList(@RequestBody PageReq pageReq) {
        return environmentDataService.getEnvironmentDataList(pageReq);
    }

}
