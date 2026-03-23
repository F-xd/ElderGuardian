package com.example.elderguardiancore.mapper;

import com.example.elderguardiancore.pojo.dto.UserDTO;
import com.example.elderguardiancore.pojo.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = { RoomMapper.class, HealthDeviceSummaryMapper.class })
public interface UserMapper {
    UserDTO toUserDTO(User user);

    List<UserDTO> toUserDTOList(List<User> userList);
}
