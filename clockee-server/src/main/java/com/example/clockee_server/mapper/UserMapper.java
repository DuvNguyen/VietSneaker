package com.example.clockee_server.mapper;

import com.example.clockee_server.entity.Role;
import com.example.clockee_server.entity.User;
import com.example.clockee_server.payload.dto.UserDetailResponse;
import com.example.clockee_server.payload.response.UserAccessDetailsResponse;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserMapper {
  private final ModelMapper mapper;

  public UserDetailResponse userToUserDetailResponse(User user) {
    return MapperUtil.mapObject(user, UserDetailResponse.class);
  }

  public UserAccessDetailsResponse userToAccessDetails(User user) {
    UserAccessDetailsResponse response =
        MapperUtil.mapObject(user, UserAccessDetailsResponse.class);
    Set<String> roles =
        user.getRoles().stream().map(Role::getAuthority).collect(Collectors.toSet());
    response.setRoles(roles);
    return response;
  }
}
