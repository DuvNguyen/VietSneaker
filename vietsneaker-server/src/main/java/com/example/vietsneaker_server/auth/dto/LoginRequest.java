package com.example.vietsneaker_server.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** LoginRequest */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
  @Email
  @NotNull(message = "Email không được để trống")
  @Schema(example = "admin@vietsneaker.com")
  private String email;

  @NotNull(message = "Mật khẩu không được để trống")
  @Schema(example = "vietsneaker123")
  private String password;
}
