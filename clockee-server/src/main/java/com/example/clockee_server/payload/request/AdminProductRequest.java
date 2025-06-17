package com.example.clockee_server.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AdminProductRequest {
  @NotBlank(message = "Product's name should not be empty")
  private String name;

  // description can be used if needed
  private String description;

  @NotNull(message = "actual price should not be empty")
  private Double actualPrice;

  @NotNull(message = "sell price should not be empty")
  private Double sellPrice;

  // Product can be used if needed
  private String type;

  @NotNull(message = "brand's id can not be empty")
  private Long brandId;

  private boolean isActive;
  private boolean visible;
}
