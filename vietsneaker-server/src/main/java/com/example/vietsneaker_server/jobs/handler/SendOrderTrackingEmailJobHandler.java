package com.example.vietsneaker_server.jobs.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;

import com.example.vietsneaker_server.jobs.requests.SendOrderTrackingEmailJob;
import com.example.vietsneaker_server.service.SendEmailService;

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
