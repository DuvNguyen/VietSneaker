package com.example.vietsneaker_server.exception;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** ApiException */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiException extends RuntimeException {
  private String message;
  private int status = 400;
  private Map<String, String> errors;
}
