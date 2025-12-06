package com.example.vietsneaker_server.auth.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** JwtTokenResponse */
@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class JwtTokenResponse {
  private String accessToken;

  private String type = "Bearer";
  private Long userId;
  private String username;
  private String name;
  private List<String> roles;
  private boolean isVerified;
}
