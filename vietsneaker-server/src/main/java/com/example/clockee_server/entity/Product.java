package com.example.clockee_server.entity;

import com.example.clockee_server.util.Client;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Nationalized;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "products")
@Client
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "product_id")
  private Long productId;

  @Column(nullable = false, length = 255)
  @Nationalized
  private String name;

  @Column @Lob @Nationalized private String description;

  @Column(name = "image_url", length = 255)
  private String imageUrl;

  @Column(name = "actual_price", precision = 10, nullable = false)
  private Double actualPrice;

  @Column(name = "sell_price", precision = 10, nullable = false)
  private Double sellPrice;

  @Column private String type;

  @Column(nullable = false, columnDefinition = "BIGINT DEFAULT 0")
  private Long stock;

  @ManyToOne
  @JoinColumn(name = "brand_id", nullable = false)
  private Brand brand;

  @Column(name = "is_active")
  private Boolean isActive;

  private Boolean visible;

  @Column(name = "is_deleted")
  private Boolean isDeleted = false;

  @Column(name = "created_at", updatable = false)
  @CreationTimestamp
  private LocalDateTime createdAt;

  // @Version
  // private Long version;

}
