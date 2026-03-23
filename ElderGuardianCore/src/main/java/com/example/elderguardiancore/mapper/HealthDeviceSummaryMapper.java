package com.example.elderguardiancore.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.elderguardiancore.pojo.dto.HealthDeviceSummaryDTO;
import com.example.elderguardiancore.pojo.entity.HealthDevice;

@Mapper(componentModel = "spring")
public interface HealthDeviceSummaryMapper {
    // 映射方法
    public HealthDeviceSummaryDTO mapToDTO(HealthDevice healthDevice);

    List<HealthDeviceSummaryDTO> toDTOList(List<HealthDevice> deviceList);
}
