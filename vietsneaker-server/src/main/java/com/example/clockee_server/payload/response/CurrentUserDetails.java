package com.example.clockee_server.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrentUserDetails {
  private Long userId;
  private String email;
  private String name;
  // TODO: custom phone validator
  private String phone;
  private String address;
  private boolean isVerified;
}
