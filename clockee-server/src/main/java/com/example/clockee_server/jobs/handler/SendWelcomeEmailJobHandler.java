package com.example.clockee_server.jobs.handler;

import com.example.clockee_server.jobs.requests.SendWelcomeEmailJob;
import com.example.clockee_server.service.SendEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;

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
