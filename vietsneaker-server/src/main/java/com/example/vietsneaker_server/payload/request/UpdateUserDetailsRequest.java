package com.example.vietsneaker_server.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserDetailsRequest {
  @NotBlank(message = "Tên được để trống")
  private String name;

  @Length(max = 11, message = "Số điện thoại tối đa 11 ký tự")
  @NotBlank(message = "Số điện thoại không được để trống")
  private String phone;

  @NotBlank(message = "Địa chỉ không được để trống")
  private String address;
}
