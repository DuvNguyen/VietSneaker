package com.example.vietsneaker_server.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;

/** If no JWT has been supplied an AuthenticationCredentialsNotFoundException is thrown. */
@Log4j2
@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException, ServletException {
    log.error("Unauthorized error: {}", authException.getMessage());
    response.sendError(
        HttpServletResponse.SC_UNAUTHORIZED, AppMessage.of(MessageKey.UNAUTHORZIED_REQUEST));
  }
}
