package com.example.vietsneaker_server.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.example.vietsneaker_server.config.ApplicationProperties;
import com.example.vietsneaker_server.email.EmailService;
import com.example.vietsneaker_server.email.dto.OrderEmailContext;
import com.example.vietsneaker_server.entity.OrderStatus;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.entity.VerificationCode;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.repository.UserRepository;
import com.example.vietsneaker_server.repository.VerificationCodeRepository;
import java.util.Optional;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.quality.Strictness;
import org.mockito.junit.jupiter.MockitoSettings;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT) // Add this annotation
class SendEmailServiceTest {

  @Mock private UserRepository userRepository;
  @Mock private ApplicationProperties applicationProperties;
  @Mock private TemplateEngine templateEngine;
  @Mock private EmailService emailService;
  @Mock private VerificationCodeRepository verificationCodeRepository;

  @InjectMocks private SendEmailServiceImpl sendEmailService;

  private User testUser;
  private VerificationCode testVerificationCode;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setUserId(1L);
    testUser.setName("Test User");
    testUser.setEmail("test@example.com");

    testVerificationCode = new VerificationCode();
    testVerificationCode.setCode("test_code");
    testVerificationCode.setEmailSent(false);
    testVerificationCode.setUser(testUser);
    testUser.setVerificationCode(testVerificationCode);

    when(applicationProperties.getBaseUrl()).thenReturn("http://localhost:8080");
    when(applicationProperties.getApplicationName()).thenReturn("VietSneaker");
  }

  @Test
  void sendWelcomeEmail_UserFoundAndEmailNotSent_EmailIsSentAndCodeUpdated() {
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
    when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>Welcome</html>");

    sendEmailService.sendWelcomeEmail(1L);

    verify(userRepository, times(1)).findById(1L);
    verify(templateEngine, times(1)).process(eq("welcome-email"), any(Context.class));
    verify(emailService, times(1))
        .sendHtmlMessage(eq(List.of(testUser.getEmail())), eq("Welcome to our platform"), eq("<html>Welcome</html>"));
    assertTrue(testVerificationCode.getEmailSent());
    verify(verificationCodeRepository, times(1)).save(testVerificationCode);
  }

  @Test
  void sendWelcomeEmail_UserFoundAndEmailAlreadySent_EmailIsNotSent() {
    testVerificationCode.setEmailSent(true); // Simulate email already sent
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

    sendEmailService.sendWelcomeEmail(1L);

    verify(userRepository, times(1)).findById(1L);
    verifyNoInteractions(templateEngine);
    verifyNoInteractions(emailService);
    verify(verificationCodeRepository, never()).save(any(VerificationCode.class));
  }

  @Test
  void sendWelcomeEmail_UserNotFound_ThrowsResourceNotFoundException() {
    when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

    ResourceNotFoundException exception =
        assertThrows(ResourceNotFoundException.class, () -> sendEmailService.sendWelcomeEmail(1L));

    assertEquals("USER_NOT_FOUND", exception.getMessage());
    verify(userRepository, times(1)).findById(1L);
    verifyNoInteractions(templateEngine);
    verifyNoInteractions(emailService);
    verifyNoInteractions(verificationCodeRepository);
  }
    @Test
    void sendWelcomeEmail_UserFoundButNoVerificationCode_EmailIsNotSent() {
        testUser.setVerificationCode(null);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        sendEmailService.sendWelcomeEmail(1L);

        verify(userRepository, times(1)).findById(1L);
        verifyNoInteractions(templateEngine);
        verifyNoInteractions(emailService);
        verifyNoInteractions(verificationCodeRepository);
    }


    @Test
    void sendOrderTrackingEmail_ValidData_EmailIsSent() {
        OrderStatus orderStatus = OrderStatus.PROCESSING; // Using an existing enum value
        OrderEmailContext orderContext = new OrderEmailContext();
        String userEmail = "customer@example.com";

        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>Order Update</html>");

        sendEmailService.sendOrderTrackingEmail(orderStatus, orderContext, userEmail);

        verify(templateEngine, times(1)).process(eq(orderStatus.getEmailTemplate()), any(Context.class));
        verify(emailService, times(1))
            .sendHtmlMessage(eq(List.of(userEmail)), eq(orderStatus.getEmailTitle()), eq("<html>Order Update</html>"));
    }

    @Test
    void sendOrderTrackingEmail_NullEmailTemplate_EmailIsNotSent() {
        OrderStatus orderStatus = OrderStatus.RETURNING; // This enum has null emailTemplate
        OrderEmailContext orderContext = new OrderEmailContext();
        String userEmail = "customer@example.com";

        sendEmailService.sendOrderTrackingEmail(orderStatus, orderContext, userEmail);

        verifyNoInteractions(templateEngine);
        verifyNoInteractions(emailService);
    }
}
