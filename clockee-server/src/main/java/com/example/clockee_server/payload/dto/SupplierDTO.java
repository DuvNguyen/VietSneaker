package com.example.clockee_server.payload.dto;

import lombok.*;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierDTO {
  private Long supplierId;
  private String name;
  private String address;

  @Length(max = 11, message = "Số điện có tối đa 10 chữ số")
  private String phone;

  private String email;
}
