package com.example.vietsneaker_server.exception;

/** ResourceNotFoundException */
public class ResourceNotFoundException extends RuntimeException {
  public ResourceNotFoundException(String resourceName) {
    super(resourceName);
  }
}
