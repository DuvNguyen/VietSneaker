package com.example.vietsneaker_server.payload.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
  @Length(max = 11, message = "Số điện thoại tối đa 11 ký tự")
  private String phone;

  @NotBlank(message = "Địa chỉ không được để trống")
  private String address;

  private List<CartItemRequest> items;
}
