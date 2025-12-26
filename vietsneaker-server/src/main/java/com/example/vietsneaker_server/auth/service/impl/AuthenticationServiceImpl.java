package com.example.vietsneaker_server.auth.service.impl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.jobrunr.scheduling.BackgroundJobRequest;
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
                () -> {
                  return ApiException.builder().message("ROLE_NOT_FOUND").status(500).build();
                });
    User user = new User(req);
    user.setRoles(Set.of(customerRole));
    userRepository.save(user);

    sendVerificationEmail(user);
  }

  @Transactional
  public void sendVerificationEmail(User user) {
    // Save token to check if user active email
    VerificationCode verification = new VerificationCode(user);
    user.setVerificationCode(verification);
    verificationCodeRepository.save(verification);

    // Sent email async
    SendWelcomeEmailJob sendWelcomeEmailJob = new SendWelcomeEmailJob(user.getUserId());
    BackgroundJobRequest.enqueue(sendWelcomeEmailJob);
  }

  @Override
  public JwtTokenResponse login(LoginRequest req, HttpServletResponse response) {
    // Authenticate with username password
    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
        new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword());

    Authentication auth = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
    // After authenticate via filter, save context if authenticated user
    SecurityContext context = SecurityContextHolder.getContext();
    context.setAuthentication(auth);
    SecurityContextHolder.setContext(context);

    // Build jwt token for REST stateless
    User currentUser = (User) auth.getPrincipal();
    List<String> roles =
        currentUser.getRoles().stream()
            .map(
                (role) -> {
                  return role.getRoleName().getName();
                })
            .collect(Collectors.toList());

    String jwtToken = jwtTokenProvider.genenerateToken(currentUser);
    String refreshToken = jwtTokenProvider.generateRefreshToken(currentUser);

    var resp = MapperUtil.mapObject(currentUser, JwtTokenResponse.class);
    resp.setAccessToken(jwtToken);
    resp.setRoles(currentUser.getRoles().stream().map(Role::getAuthority).toList());

    addRefreshTokenAsCookie(ApplicationConstants.REFRESH_COOKIE_NAME, refreshToken, response);

    return resp;
  }

  public RefreshTokenResponse refresh(String refreshToken, HttpServletResponse response) {
    if (refreshToken == null) {
      throw new BadCredentialsException(AppMessage.of(MessageKey.MISSING_REFRESH_TOKEN));
    }
    String userEmail = jwtTokenProvider.getUsername(refreshToken);
    User user = userRepository.findByEmail(userEmail).orElse(null);

    if (!jwtTokenProvider.isValidRefreshToken(refreshToken, user)) {
      throw new BadCredentialsException(AppMessage.of(MessageKey.INVALID_REFRESH_TOKEN));
    }

    String newAccessToken = jwtTokenProvider.genenerateToken(user);
    var tokenResponse = MapperUtil.mapObject(user, RefreshTokenResponse.class);
    tokenResponse.setAccessToken(newAccessToken);
    tokenResponse.setRoles(user.getRoles().stream().map(Role::getAuthority).toList());
    return tokenResponse;
  }

  /** Save refresh token to http only cookie on response */
  @Override
  public void addRefreshTokenAsCookie(
      String cookieName, String refreshToken, HttpServletResponse response) {
    
   ResponseCookie cookie = ResponseCookie.from(cookieName, refreshToken)
    .httpOnly(true)
    .secure(true)
    .sameSite("None")
    .path("/")
    .maxAge(applicationProperties.getJwtRefreshTokenExpDays() * 24L * 60 * 60)
    .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }

  @Override
  public void clearRefreshTokenCookie(String cookieName, HttpServletResponse response) {
    Cookie cookie = new Cookie(cookieName, null);
    cookie.setMaxAge(0);
    cookie.setSecure(true);
    cookie.setHttpOnly(true);
    cookie.setPath("/");
    response.addCookie(cookie);
  }

  @Override
  public void verify(Long userId, int tokenCode) {
    User user =
        userRepository
            .findByIdWithVerificationCode(userId)
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
