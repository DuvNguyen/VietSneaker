package com.example.vietsneaker_server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import com.example.vietsneaker_server.util.Client;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "brands")
@Client
public class Brand {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "brand_id")
  private Long brandId;

  @Column(length = 255, nullable = false)
  @Nationalized
  private String name;

  @Column(name = "is_deleted")
  private Boolean isDeleted;

  @OneToMany(mappedBy = "brand", fetch = FetchType.LAZY)
  private Set<Product> products;
}
