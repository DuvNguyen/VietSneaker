package com.example.clockee_server.payload.dto;

import com.example.clockee_server.entity.enums.SupplierType;
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

    @Length(max = 11, message = "Số điện thoại tối đa 11 chữ số")
    private String phone;

    private String email;

    // --- Trường mới ---

    private SupplierType supplierType;

    @Length(max = 100)
    private String zalo;

    @Length(max = 255)
    private String facebook;

    private Integer rating;

    private Long totalTransactions; // READ-ONLY

    @Length(max = 5000)
    private String notes;
}
