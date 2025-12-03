package com.example.vietsneaker_server.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyRevenueDTO {
  private Integer year;
  private Integer month;
  private Double revenue;
}
