package com.example.clockee_server.service.user;

import com.example.clockee_server.auth.service.AuthenticationService;
import com.example.clockee_server.entity.User;
import com.example.clockee_server.entity.VerificationCode;
import com.example.clockee_server.exception.ApiException;
import com.example.clockee_server.jobs.requests.SendWelcomeEmailJob;
import com.example.clockee_server.mapper.MapperUtil;
import com.example.clockee_server.message.AppMessage;
import com.example.clockee_server.message.MessageKey;
import com.example.clockee_server.payload.request.ChangePasswordRequest;
import com.example.clockee_server.payload.request.UpdateUserDetailsRequest;
import com.example.clockee_server.payload.response.CurrentUserDetails;
import com.example.clockee_server.repository.UserRepository;
import com.example.clockee_server.repository.VerificationCodeRepository;
import lombok.RequiredArgsConstructor;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** UserService */
@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final VerificationCodeRepository verificationCodeRepository;
  private final AuthenticationService authenticationService;

  public CurrentUserDetails currentUserDetails(User user) {
    return MapperUtil.mapObject(user, CurrentUserDetails.class);
  }

  public void updateUserDetails(User user, UpdateUserDetailsRequest details) {
    user.setName(details.getName());
    user.setPhone(details.getPhone());
    user.setAddress(details.getAddress());
    userRepository.save(user);
  }

  public void changePassword(User user, ChangePasswordRequest request) {
    // Validate old password is valid

    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
      throw ApiException.builder().message(AppMessage.of(MessageKey.WRONG_PASSWORD)).build();
    }
    user.updatePassword(request.getNewPassword());
    userRepository.save(user);
  }

  @Modifying
  @Transactional
  public void resendVerificationEmail(User user) {
    if (user.isVerified()) {
      throw ApiException.builder()
          .status(400)
          .message(AppMessage.of(MessageKey.ALREADY_VERIFIED))
          .build();
    }

    VerificationCode verificationCode = user.getVerificationCode();
    // Delete old verfied code then create new one and send email
    user.setVerificationCode(null);
    verificationCodeRepository.delete(verificationCode);
    // Need to flush change instead of mark deleted in persistence context
    verificationCodeRepository.flush();
    VerificationCode newVerification = new VerificationCode(user);
    user.setVerificationCode(newVerification);
    verificationCodeRepository.save(newVerification);

    // Sent email async
    SendWelcomeEmailJob sendWelcomeEmailJob = new SendWelcomeEmailJob(user.getUserId());
    BackgroundJobRequest.enqueue(sendWelcomeEmailJob);
  }
}
