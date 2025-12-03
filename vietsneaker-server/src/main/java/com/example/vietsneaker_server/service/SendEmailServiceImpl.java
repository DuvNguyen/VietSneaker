package com.example.vietsneaker_server.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.example.vietsneaker_server.config.ApplicationProperties;
import com.example.vietsneaker_server.email.EmailService;
import com.example.vietsneaker_server.email.dto.OrderEmailContext;
import com.example.vietsneaker_server.entity.OrderStatus;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.entity.VerificationCode;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.repository.UserRepository;
import com.example.vietsneaker_server.repository.VerificationCodeRepository;

@RequiredArgsConstructor
@Service
@Log4j2
public class SendEmailServiceImpl implements SendEmailService {

  private final UserRepository userRepository;
  private final ApplicationProperties applicationProperties;
  private final TemplateEngine templateEngine;
  private final EmailService emailService;
  private final VerificationCodeRepository verificationCodeRepository;

  @Override
  public void sendWelcomeEmail(Long userId) {
    log.info("Run job sent email welcome user {}", userId);
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND"));
    if (user.getVerificationCode() != null && !user.getVerificationCode().getEmailSent()) {
      sendWelcomeEmail(user, user.getVerificationCode());
    }
  }

  private void sendWelcomeEmail(User user, VerificationCode verificationCode) {

    String verificationLink =
        applicationProperties.getBaseUrl()
            + "/verify-email?token="
            + verificationCode.getCode()
            + "&userId="
            + user.getUserId();
    Context emailContext = new Context();
    emailContext.setVariable("username", user.getName());
    emailContext.setVariable("verificationLink", verificationLink);
    emailContext.setVariable("applicationName", applicationProperties.getApplicationName());

    String htmlBody = templateEngine.process("welcome-email", emailContext);
    emailService.sendHtmlMessage(List.of(user.getEmail()), "Welcome to our platform", htmlBody);
    verificationCode.setEmailSent(true);
    verificationCodeRepository.save(verificationCode);
  }

  @Override
  public void sendOrderTrackingEmail(
      OrderStatus orderStatus, OrderEmailContext orderContext, String userEmail) {
    Context context = new Context();
    context.setVariable("orderEmailInfo", orderContext);
    if (orderStatus.getEmailTemplate() == null) {
      return;
    }
    String htmlBody = templateEngine.process(orderStatus.getEmailTemplate(), context);
    emailService.sendHtmlMessage(List.of(userEmail), orderStatus.getEmailTitle(), htmlBody);
  }
}
