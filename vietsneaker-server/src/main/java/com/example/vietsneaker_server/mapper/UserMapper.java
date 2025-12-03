package com.example.vietsneaker_server.mapper;

import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.example.vietsneaker_server.entity.Role;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.payload.dto.UserDetailResponse;
import com.example.vietsneaker_server.payload.response.UserAccessDetailsResponse;

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
