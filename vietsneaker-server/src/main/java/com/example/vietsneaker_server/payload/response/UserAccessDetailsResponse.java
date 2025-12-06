package com.example.vietsneaker_server.payload.response;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccessDetailsResponse {

  private Long userId;
  private String email;
  private String name;
  private String phone;
  private Boolean isDeleted;
  private String address;
  private Boolean enabled;
  private boolean isVerified;
  private Set<String> roles;
}
