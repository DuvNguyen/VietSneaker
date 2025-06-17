package com.example.clockee_server.payload.request;

import com.example.clockee_server.validatetor.PasswordMatch;
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
public class ChangePasswordRequest {

  private String oldPassword;

  // @NotBlank(message = "mật khẩu không được trống")
  // @Length(min = 8, message = "Mật khẩu cần tối thiểu 8 ký tự")
  // @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "must contain at least one
  // uppercase letter, one lowercase letter, and one digit.")
  @Schema(example = "vana123@gmail")
  private String newPassword;

  @Schema(example = "vana123@gmail")
  private String newPasswordConfirmation;
}
