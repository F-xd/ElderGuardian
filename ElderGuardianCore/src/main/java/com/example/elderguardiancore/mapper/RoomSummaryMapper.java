package com.example.elderguardiancore.mapper;

import com.example.elderguardiancore.pojo.dto.RoomSummaryDTO;
import com.example.elderguardiancore.pojo.entity.Room;
import org.mapstruct.Mapper;


import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomSummaryMapper {
    RoomSummaryDTO toDTO(Room room);
    List<RoomSummaryDTO> toDTOList(List<Room> roomList);
}
