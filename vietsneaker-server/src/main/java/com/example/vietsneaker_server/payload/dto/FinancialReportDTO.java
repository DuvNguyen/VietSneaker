package com.example.vietsneaker_server.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FinancialReportDTO {
  private Double totalSale;
  //    private Double totalPurchase;
  //    private Double profit;
}
