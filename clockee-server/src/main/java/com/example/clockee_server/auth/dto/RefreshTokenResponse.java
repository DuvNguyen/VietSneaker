package com.example.clockee_server.auth.dto;

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
public class RefreshTokenResponse {
  private String accessToken;
  private String type = "Bearer";
  private Long userId;
  private String username;
  private List<String> roles;
  private boolean isVerified;
}
