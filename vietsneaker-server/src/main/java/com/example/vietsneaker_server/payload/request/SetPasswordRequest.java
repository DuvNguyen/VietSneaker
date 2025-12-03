package com.example.vietsneaker_server.payload.request;

import com.example.vietsneaker_server.validatetor.PasswordMatch;

import io.swagger.v3.oas.annotations.media.Schema;
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
@PasswordMatch(
    passwordField = "newPassword",
    passwordConfirmationFieldName = "newPasswordConfirmation")
public class SetPasswordRequest {

  @Schema(example = "vana123@gmail")
  private String newPassword;

  @Schema(example = "vana123@gmail")
  private String newPasswordConfirmation;
}
