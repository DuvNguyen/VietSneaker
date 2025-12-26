package com.example.vietsneaker_server.payload.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductHistoryDTO {
    private Long productId;
    private String name;
    private String type;
    private String brand;
    private Long quantity;   // Long (khớp OrderItem)
    private Double price;    // Double (khớp OrderItem)
}
