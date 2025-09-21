package com.example.clockee_server.auth;

import lombok.extern.log4j.Log4j2;
import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Log4j2
public class HttpRedirectRequest {

  @Value("${server.insecure-port:8081}")
  private int insecurePort;

  @Value("${server.port:8080}")
  private int securePort;

  @Bean
  public ServletWebServerFactory servletContainer() {

    var tomcat =
        new TomcatServletWebServerFactory() {

          @Override
          protected void postProcessContext(Context context) {

            var securityConstraint = new SecurityConstraint();
            securityConstraint.setUserConstraint("CONFIDENTIAL");

            var collection = new SecurityCollection();
            collection.addPattern("/*");
            securityConstraint.addCollection(collection);
            context.addConstraint(securityConstraint);
          }
        };

    tomcat.addAdditionalTomcatConnectors(redirectConnector());
    return tomcat;
  }

  private Connector redirectConnector() {
    var connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
    connector.setScheme("http");
    connector.setPort(insecurePort);
    connector.setSecure(false);
    connector.setRedirectPort(securePort);

    return connector;
  }
}
