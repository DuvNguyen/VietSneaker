package com.example.clockee_server.entity;

import com.example.clockee_server.util.Client;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import com.example.clockee_server.entity.enums.SupplierType;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "suppliers")
@Client
public class Supplier {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "supplier_id")
  private Long supplierId;

  @Column(length = 255, nullable = false)
  @Nationalized
  private String name;

  @Column 
  @Nationalized 
  private String address;

  @Column(length = 11)
  private String phone;

  @Column(length = 255)
  private String email;

  @Column(name = "is_deleted")
  private Boolean isDeleted;

  @Enumerated(EnumType.STRING)
  @Column(name = "supplier_type", length = 20)
  private SupplierType supplierType;

  @Column(length = 100)
  private String zalo;

  @Column(length = 255)
  private String facebook;

  @Column
  private Integer rating;

  @Column(name = "total_transactions")
  private Long totalTransactions;

  @Lob
  @Column
  @Nationalized
  private String notes;
}
