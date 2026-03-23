package com.example.elderguardiancore.mapper;

import com.example.elderguardiancore.pojo.dto.UserSummaryDTO;
import com.example.elderguardiancore.pojo.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserSummaryMapper {
    UserSummaryDTO toDTO(User user);
    List<UserSummaryDTO> toDTOList(List<User> userList);
}
