package com.example.elderguardiancore.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elderguardiancore.pojo.dto.AlarmDTO;
import com.example.elderguardiancore.pojo.entity.Alarm;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.response.PageRes;
import com.example.elderguardiancore.service.interfaces.IAlarmService;
import com.example.elderguardiancore.utils.JWTUtils;

@CrossOrigin
@RestController
@RequestMapping("/alarm")
public class AlarmController {
    @Autowired
    private IAlarmService alarmService;

    @PostMapping("/list")
    public ResponseMessage<PageRes<AlarmDTO>> getAlarmList(@RequestBody PageReq pageReq) {
        return alarmService.getAlarmList(pageReq);
    }

    @PostMapping("/handle")
    public ResponseMessage<String> handleAlarm(@RequestBody Alarm alarm, @RequestHeader("Authorization") String token) {
        Long userId = JWTUtils.getUserFromToken(token).getUserId();
        return alarmService.handleAlarm(alarm, userId);
    }

    @PostMapping("/delete")
    public ResponseMessage<String> deleteAlarm(@RequestBody Map<String, Long> request) {
        return alarmService.deleteAlarm(request.get("id"));
    }

    @PostMapping("/deleteBatch")
    public ResponseMessage<AlarmDTO> deleteBatchAlarm(@RequestBody Map<String, List<Long>> request) {
        return alarmService.deleteBatchAlarm(request.get("ids"));
    }

    // 查询所有未处理的报警
    @GetMapping("/unhandled")
    public ResponseMessage<List<AlarmDTO>> getUnhandledAlarmList() {
        return alarmService.getUnhandledAlarmList();
    }
}
