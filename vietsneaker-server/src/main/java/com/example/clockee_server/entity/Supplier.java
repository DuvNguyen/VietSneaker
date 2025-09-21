package com.example.clockee_server.entity;

import com.example.clockee_server.util.Client;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

  @Column @Lob @Nationalized private String address;

  @Column(length = 11)
  private String phone;

  @Column(length = 255)
  private String email;

  @Column(name = "is_deleted")
  private Boolean isDeleted;
}
