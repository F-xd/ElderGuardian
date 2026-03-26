package com.example.elderguardiancore.service.interfaces;

import java.util.List;

import com.example.elderguardiancore.pojo.dto.AlarmDTO;
import com.example.elderguardiancore.pojo.entity.Alarm;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.response.PageRes;

public interface IAlarmService {
    /**
     * 获取智能警报列表
     * 
     * @param pageReq
     * @return 智能警报列表分页响应
     */
    ResponseMessage<PageRes<AlarmDTO>> getAlarmList(PageReq pageReq);

    /**
     * 处理智能警报
     * 
     * @param alarm 智能警报实体
     * @return 处理结果
     */
    ResponseMessage<String> handleAlarm(Alarm alarm, Long handleUserId);

    /**
     * 删除智能警报
     * 
     * @param id 智能警报ID
     * @return 删除结果
     */
    ResponseMessage<String> deleteAlarm(Long id);

    /**
     * 批量删除智能警报
     * 
     * @param ids 智能警报ID列表
     * @return 批量删除结果
     */
    ResponseMessage<AlarmDTO> deleteBatchAlarm(List<Long> ids);
}
