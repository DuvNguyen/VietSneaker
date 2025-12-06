package com.example.vietsneaker_server.validatetor;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.lang.reflect.Field;

/** PasswordMatchValidator */
public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, Object> {
  private String passwordFieldName;
  private String passwordConfirmationFieldName;

  @Override
  public void initialize(PasswordMatch constraintAnnotation) {
    passwordFieldName = constraintAnnotation.passwordField();
    passwordConfirmationFieldName = constraintAnnotation.passwordConfirmationFieldName();
  }

  @Override
  public boolean isValid(Object value, ConstraintValidatorContext context) {
    try {
      Class<?> clazz = value.getClass();
      Field passwordField = clazz.getDeclaredField(passwordFieldName);
      Field passwordMatchField = clazz.getDeclaredField(passwordConfirmationFieldName);
      passwordField.setAccessible(true);
      passwordMatchField.setAccessible(true);
      String password = (String) passwordField.get(value);
      String passwordMatch = (String) passwordMatchField.get(value);
      return password != null && password.equals(passwordMatch);

    } catch (NoSuchFieldException
        | SecurityException
        | IllegalArgumentException
        | IllegalAccessException e) {
      e.printStackTrace();
      return false;
    }
  }
}
