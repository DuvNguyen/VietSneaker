package com.example.clockee_server.util;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * ApplicationContextProvider provide method working with Bean in IoC container Use in POJO and
 * static class environment as the replacement of @Autowired Example: password =
 * passwordEncoder.encode(newPassword);
 */
@Component
public class ApplicationContextProvider implements ApplicationContextAware {
  private static ApplicationContext context;

  /** Get object type T from application context with type query T */
  public static <T> T bean(Class<T> beanType) {
    return context.getBean(beanType);
  }

  /** Get object from application context query by bean name in IoC */
  public static Object bean(String name) {
    return context.getBean(name);
  }

  @Override
  public void setApplicationContext(@SuppressWarnings("NullableProblems") ApplicationContext ac) {
    context = ac;
  }
}
