package com.example.vietsneaker_server.auth;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.exception.ApiException;
import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;

/** SecurityUtil */
@Log4j2
public class SecurityUtil {

  public static User getAuthenticationUser() {
    Optional<User> user = getOptionalAuthenticationUser();
    if (user.isPresent()) {
      return user.get();
    } else {
      log.error("Principal not found in Security Context");
      throw ApiException.builder()
          .status(401)
          .message(AppMessage.of(MessageKey.PRINCIPAL_NOT_FOUND))
          .build();
    }
  }

  public static Optional<User> getOptionalAuthenticationUser() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof User user) {
      return Optional.of(user);
    }
    return Optional.empty();
  }

  public static void setPricipalToSecurityContext(User user, HttpServletRequest request) {
    var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getRoles());
    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

    SecurityContextHolder.getContext().setAuthentication(authentication);
  }
}
