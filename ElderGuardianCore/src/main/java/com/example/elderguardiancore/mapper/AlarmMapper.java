package com.example.elderguardiancore.mapper;

import com.example.elderguardiancore.pojo.dto.AlarmDTO;
import com.example.elderguardiancore.pojo.entity.Alarm;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { RoomSummaryMapper.class, UserSummaryMapper.class })
public interface AlarmMapper {
    AlarmDTO toDTO(Alarm alarm);

    List<AlarmDTO> toDTOList(List<Alarm> alarms);
}
