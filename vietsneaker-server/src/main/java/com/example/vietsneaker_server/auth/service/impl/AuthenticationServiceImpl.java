package com.example.vietsneaker_server.auth.service.impl;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vietsneaker_server.auth.dto.CreateUserRequest;
import com.example.vietsneaker_server.auth.dto.JwtTokenResponse;
import com.example.vietsneaker_server.auth.dto.LoginRequest;
import com.example.vietsneaker_server.auth.dto.RefreshTokenResponse;
import com.example.vietsneaker_server.auth.jwt.JwtTokenProvider;
import com.example.vietsneaker_server.auth.service.AuthenticationService;
import com.example.vietsneaker_server.config.ApplicationConstants;
import com.example.vietsneaker_server.config.ApplicationProperties;
import com.example.vietsneaker_server.entity.Role;
import com.example.vietsneaker_server.entity.RoleName;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.entity.VerificationCode;
import com.example.vietsneaker_server.exception.ApiException;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.jobs.requests.SendWelcomeEmailJob;
import com.example.vietsneaker_server.mapper.MapperUtil;
import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;
import com.example.vietsneaker_server.repository.RoleRepository;
import com.example.vietsneaker_server.repository.UserRepository;
import com.example.vietsneaker_server.repository.VerificationCodeRepository;

@RequiredArgsConstructor
@Service
public class AuthenticationServiceImpl implements AuthenticationService {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final VerificationCodeRepository verificationCodeRepository;
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;
  private final ApplicationProperties applicationProperties;

  @Transactional
  public void register(CreateUserRequest req) {
    if (userRepository.existsByEmail(req.getEmail())) {
      throw ApiException.builder().message(AppMessage.of(MessageKey.EMAIL_ALREADY_EXISTS)).build();
    }

    Role customerRole =
        roleRepository
            .findByRoleName(RoleName.CUSTOMER)
            .orElseThrow(
                () -> ApiException.builder().message("ROLE_NOT_FOUND").status(500).build());
    User user = new User(req);
    user.setRoles(Set.of(customerRole));
    userRepository.save(user);

    sendVerificationEmail(user);
  }

  @Transactional
  public void sendVerificationEmail(User user) {
    VerificationCode verification = new VerificationCode(user);
    user.setVerificationCode(verification);
    verificationCodeRepository.save(verification);

    SendWelcomeEmailJob sendWelcomeEmailJob = new SendWelcomeEmailJob(user.getUserId());
    BackgroundJobRequest.enqueue(sendWelcomeEmailJob);
  }

  @Override
  public JwtTokenResponse login(LoginRequest req, HttpServletResponse response) {
    // 1. Xác thực người dùng
    UsernamePasswordAuthenticationToken authRequest =
        new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword());
    Authentication auth = authenticationManager.authenticate(authRequest);
    SecurityContextHolder.getContext().setAuthentication(auth);

    User currentUser = (User) auth.getPrincipal();

    // 2. Tạo Token
    String jwtToken = jwtTokenProvider.genenerateToken(currentUser);
    String refreshToken = jwtTokenProvider.generateRefreshToken(currentUser);

    // 3. Vẫn duy trì ghi Cookie (Dự phòng cho các trình duyệt chấp nhận)
    addRefreshTokenAsCookie(ApplicationConstants.REFRESH_COOKIE_NAME, refreshToken, response);

    // 4. Map dữ liệu trả về DTO
    var resp = MapperUtil.mapObject(currentUser, JwtTokenResponse.class);
    resp.setAccessToken(jwtToken);
    
    // QUAN TRỌNG: Gán refreshToken vào body để Frontend lưu vào LocalStorage (Fix Ảnh 12)
    resp.setRefreshToken(refreshToken); 
    
    resp.setUserId(currentUser.getUserId());
    resp.setUsername(currentUser.getEmail());
    resp.setRoles(currentUser.getRoles().stream().map(Role::getAuthority).toList());
    resp.setVerified(currentUser.isVerified());

    return resp;
}

  @Override
  public RefreshTokenResponse refresh(String refreshToken, HttpServletResponse response) {
    // Chấp nhận refreshToken truyền vào từ body/param nếu Cookie bị trống
    if (refreshToken == null || refreshToken.isEmpty()) {
      throw new BadCredentialsException(AppMessage.of(MessageKey.MISSING_REFRESH_TOKEN));
    }
    
    String userEmail = jwtTokenProvider.getUsername(refreshToken);
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new BadCredentialsException(AppMessage.of(MessageKey.INVALID_REFRESH_TOKEN)));

    if (!jwtTokenProvider.isValidRefreshToken(refreshToken, user)) {
      throw new BadCredentialsException(AppMessage.of(MessageKey.INVALID_REFRESH_TOKEN));
    }

    String newAccessToken = jwtTokenProvider.genenerateToken(user);
    
    // Cập nhật lại Cookie
    addRefreshTokenAsCookie(ApplicationConstants.REFRESH_COOKIE_NAME, refreshToken, response);

    var tokenResponse = MapperUtil.mapObject(user, RefreshTokenResponse.class);
    tokenResponse.setAccessToken(newAccessToken);
    tokenResponse.setRoles(user.getRoles().stream().map(Role::getAuthority).toList());
    return tokenResponse;
  }

  @Override
  public void addRefreshTokenAsCookie(String cookieName, String refreshToken, HttpServletResponse response) {
      // Dùng SameSite=Lax cho môi trường localhost
      ResponseCookie cookie = ResponseCookie.from(cookieName, refreshToken)
          .httpOnly(true)
          .secure(false) 
          .path("/")
          .maxAge(applicationProperties.getJwtRefreshTokenExpDays() * 24 * 60 * 60)
          .sameSite("Lax")
          .build();

      response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }

  @Override
  public void clearRefreshTokenCookie(String cookieName, HttpServletResponse response) {
    ResponseCookie cookie = ResponseCookie.from(cookieName, "")
        .httpOnly(true)
        .secure(false)
        .path("/")
        .maxAge(0)
        .sameSite("Lax")
        .build();
    response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }

  @Override
  public void verify(Long userId, int tokenCode) {
    User user = userRepository.findByIdWithVerificationCode(userId)
            .orElseThrow(() -> new ResourceNotFoundException("user"));
    
    VerificationCode verificationCode = user.getVerificationCode();
    boolean matchToken = verificationCode.getCode().equals(String.valueOf(tokenCode));
    
    if (!matchToken) {
      throw ApiException.builder()
          .status(400)
          .message(AppMessage.of(MessageKey.BAD_REQUEST))
          .build();
    }

    verificationCode.setEmailSent(true);
    user.setVerified(true);
    verificationCodeRepository.save(verificationCode);
    userRepository.save(user);
  }
}