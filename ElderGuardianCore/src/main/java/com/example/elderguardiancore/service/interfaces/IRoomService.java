package com.example.elderguardiancore.service.interfaces;

import com.example.elderguardiancore.pojo.dto.RoomDTO;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.request.AddRoomReq;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.request.RoomCheckInReq;
import com.example.elderguardiancore.pojo.response.PageRes;

import java.util.List;
import java.util.Map;

public interface IRoomService {
    /**
     * 添加房间
     *
     * @param room 房间对象
     */
    ResponseMessage<String> addRoom(AddRoomReq room);

    /**
     * 编辑房间
     *
     * @param room 房间对象
     */
    ResponseMessage<String> editRoom(AddRoomReq room);

    /**
     * 查询房间列表
     *
     * @param pageReq 分页请求对象
     * @return 房间列表分页响应对象
     */
    ResponseMessage<PageRes<RoomDTO>> getRoomList(PageReq pageReq);

    /**
     * 删除房间
     *
     * @param roomId 房间ID
     */
    ResponseMessage<String> deleteRoom(Long roomId);

    /**
     * 批量删除房间
     *
     * @param roomIds 房间ID列表
     */
    ResponseMessage<String> deleteBatch(Map<String, Object> requestBody);

    /**
     * 房间入住（添加用户到房间）
     *
     * @param roomCheckInReq 房间入住请求对象
     */
    ResponseMessage<String> checkIn(RoomCheckInReq roomCheckInReq);

    /**
     * 批量修改房间容量
     *
     * @param requestBody 包含房间更新列表的请求体
     */
    ResponseMessage<String> batchUpdateCapacity(Map<String, Object> requestBody);
}