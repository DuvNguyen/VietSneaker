package com.example.clockee_server.auth.dto;

import com.example.clockee_server.validatetor.PasswordMatch;
import io.micrometer.common.lang.Nullable;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

/** CreateUserRequest / RegisterUserRequest */
@Data
@PasswordMatch(passwordField = "password", passwordConfirmationFieldName = "passwordConfirmation")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequest {
  @Email(message = "Email không đúng định dạng")
  @NotBlank(message = "Email không được để trống")
  // @Unique(columnName = "email", tableName = "user", message = "User with this email already
  // exists")
  @Schema(example = "nguyenvana123@gmail.com")
  private String email;

  @NotBlank(message = "mật khẩu không được trống")
  @Length(min = 6, message = "Mật khẩu cần tối thiểu 8 ký tự")
  @Pattern(
      regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
      message = "must contain at least one uppercase letter, one lowercase letter, and one digit.")
  @Schema(example = "Vana123@gmail")
  private String password;

  @Schema(example = "Vana123@gmail")
  private String passwordConfirmation;

  @Nullable
  @Schema(example = "nguyen van a")
  private String name;
}
