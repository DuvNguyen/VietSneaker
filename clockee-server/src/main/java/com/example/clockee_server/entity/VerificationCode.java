package com.example.clockee_server.entity;

import com.example.clockee_server.util.Client;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.RandomStringUtils;

/** VerificationCode */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "verification_codes")
@Client
public class VerificationCode {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long verificationId;

  @Setter private Boolean emailSent = false;

  private String code;

  // Owner side
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  public VerificationCode(User user) {
    this.user = user;
    this.code = RandomStringUtils.random(6, false, true);
  }
}
