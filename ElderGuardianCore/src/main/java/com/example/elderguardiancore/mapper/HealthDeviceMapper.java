package com.example.elderguardiancore.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import com.example.elderguardiancore.pojo.dto.HealthDeviceDTO;
import com.example.elderguardiancore.pojo.entity.HealthDevice;

@Mapper(componentModel = "spring", uses = { UserSummaryMapper.class })
public interface HealthDeviceMapper {
    HealthDeviceDTO toDTO(HealthDevice healthDevice);

    List<HealthDeviceDTO> toDTOList(List<HealthDevice> healthDevicesList);

}
