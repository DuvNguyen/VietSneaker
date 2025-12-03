package com.example.vietsneaker_server.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Role IAM role manager: add new role to user */
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class UserRoleRequest {
  private Long userId;
  private String role;
}
