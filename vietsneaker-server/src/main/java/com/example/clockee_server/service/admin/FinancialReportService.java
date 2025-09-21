package com.example.clockee_server.service.admin;

import com.example.clockee_server.repository.OrderRepository;
import com.example.clockee_server.repository.PurchaseRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FinancialReportService {
  @Autowired private OrderRepository orderRepository;

  @Autowired private PurchaseRepository purchaseRepository;

  public Double getFinancialReport(int year, int month) {
    Double totalSale =
        Optional.ofNullable(orderRepository.sumTotalPriceSale(year, month)).orElse(0.0);
    //        Double totalPurchase = Optional.ofNullable(purchaseRepository.totalPricePurchase(year,
    // month)).orElse(0.0);
    //
    //        Double profit = totalSale - totalPurchase;
    return totalSale;
  }
}
