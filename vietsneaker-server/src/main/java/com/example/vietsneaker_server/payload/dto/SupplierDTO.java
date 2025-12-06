package com.example.vietsneaker_server.payload.dto;

import lombok.*;
import org.hibernate.validator.constraints.Length;

import com.example.vietsneaker_server.entity.enums.SupplierType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierDTO {

    private Long supplierId;

    private String name;

    private String address;

    @Length(max = 11, message = "Số điện thoại tối đa 11 chữ số")
    private String phone;

    private String email;

    // --- Trường mới ---

    private SupplierType supplierType;

    @Length(max = 100)
    private String zalo;

    @Length(max = 255)
    private String facebook;

    @Min(1)
    @Max(5)
    private Integer rating;

    private Long totalTransactions; // READ-ONLY

    @Length(max = 5000)
    private String notes;
}
