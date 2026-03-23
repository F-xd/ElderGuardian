package com.example.elderguardiancore.mapper;

import com.example.elderguardiancore.pojo.dto.DeviceSummaryDTO;
import com.example.elderguardiancore.pojo.entity.Device;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DeviceSummaryMapper {
    DeviceSummaryDTO toDTO(Device device);
    List<DeviceSummaryDTO> toDTOList(List<Device> deviceList);
}
