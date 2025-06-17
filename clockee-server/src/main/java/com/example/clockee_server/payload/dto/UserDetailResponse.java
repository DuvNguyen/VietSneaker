package com.example.clockee_server.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailResponse {
  private Long userId;
  private String email;
  private String name;
  private String phone;
  private Boolean isDeleted;
  private String address;
  private Boolean enabled;
}
