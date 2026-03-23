package com.example.elderguardiancore.mapper;

import com.example.elderguardiancore.pojo.dto.RoomDTO;
import com.example.elderguardiancore.pojo.entity.Room;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {DeviceSummaryMapper.class, UserSummaryMapper.class})
public interface RoomMapper {
    /**
     * 将Room实体转换为RoomDTO
     * @param room 房间实体
     * @return 房间DTO
     */
    RoomDTO toDTO(Room room);
    List<RoomDTO> toDTOList(List<Room> roomList);
}
