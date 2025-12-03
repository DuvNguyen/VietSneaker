package com.example.vietsneaker_server.controller.admin;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vietsneaker_server.service.admin.FinancialReportService;

@RestController
@RequestMapping("/financial-report")
public class FinancialReportController {
  @Autowired private FinancialReportService financialReportService;

  @GetMapping("/by-year")
  public ResponseEntity<List<Double>> geFinancialReport(@RequestParam("year") int year) {
    List<Double> reports = new ArrayList<>();

    for (int month = 1; month <= 12; month++) {
      Double report = financialReportService.getFinancialReport(year, month);
      reports.add(report);
    }

    return ResponseEntity.ok(reports);
  }
}
