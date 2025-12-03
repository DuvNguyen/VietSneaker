package com.example.vietsneaker_server.jobs.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;

import com.example.vietsneaker_server.jobs.requests.SendWelcomeEmailJob;
import com.example.vietsneaker_server.service.SendEmailService;

/** SendWelcomeEmailJobHandler */
@Component
@Log4j2
@RequiredArgsConstructor
public class SendWelcomeEmailJobHandler implements JobRequestHandler<SendWelcomeEmailJob> {
  private final SendEmailService sendEmailService;

  @Override
  public void run(SendWelcomeEmailJob jobRequest) throws Exception {
    Long userId = jobRequest.getUserId();
    if (userId == null) {
      return;
    }
    log.info("Sent welcome email to user: {}", userId);
    sendEmailService.sendWelcomeEmail(userId);
  }
}
