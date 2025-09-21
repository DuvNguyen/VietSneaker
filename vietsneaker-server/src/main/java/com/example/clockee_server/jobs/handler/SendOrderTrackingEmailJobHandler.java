package com.example.clockee_server.jobs.handler;

import com.example.clockee_server.jobs.requests.SendOrderTrackingEmailJob;
import com.example.clockee_server.service.SendEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;

/** SendOrderTrackingEmailJobHandler */
@Component
@Log4j2
@RequiredArgsConstructor
public class SendOrderTrackingEmailJobHandler
    implements JobRequestHandler<SendOrderTrackingEmailJob> {
  private final SendEmailService sendEmailService;

  @Override
  public void run(SendOrderTrackingEmailJob jobRequest) throws Exception {
    sendEmailService.sendOrderTrackingEmail(
        jobRequest.getOrderStatus(), jobRequest.getEmailInfo(), jobRequest.getUserEmail());
  }
}
