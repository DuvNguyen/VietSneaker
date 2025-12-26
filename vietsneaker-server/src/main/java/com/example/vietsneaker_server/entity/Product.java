package com.example.vietsneaker_server.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;


import com.example.vietsneaker_server.util.Client;


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
  private String name;


  @Lob
  @Column
  private String description;


  @Column(name = "image_url", length = 255)
  private String imageUrl;


  @Column(name = "actual_price", precision = 10, nullable = false)
  private Double actualPrice;


  @Column(name = "sell_price", precision = 10, nullable = false)
  private Double sellPrice;


  @Column private String type;


  @Column(name = "shoe_size", length = 10)
  private String shoeSize;


  @Column(nullable = false)
  private Long stock = 0L;


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
}
