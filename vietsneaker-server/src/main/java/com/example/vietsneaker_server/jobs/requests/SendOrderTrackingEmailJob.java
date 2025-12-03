package com.example.vietsneaker_server.jobs.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import org.jobrunr.jobs.lambdas.JobRequest;
import org.jobrunr.jobs.lambdas.JobRequestHandler;

import com.example.vietsneaker_server.email.dto.OrderEmailContext;
import com.example.vietsneaker_server.entity.OrderStatus;
import com.example.vietsneaker_server.jobs.handler.SendOrderTrackingEmailJobHandler;

/** SendOrderTrackingEmailJob */
@Getter
public class SendOrderTrackingEmailJob implements JobRequest {
  @NotNull private OrderEmailContext emailInfo;
  @NotNull private OrderStatus orderStatus;
  @NotNull private String userEmail;

  public SendOrderTrackingEmailJob(
      @NotNull OrderEmailContext emailInfo,
      @NotNull OrderStatus orderStatus,
      @NotNull String userEmail) {
    this.emailInfo = emailInfo;
    this.orderStatus = orderStatus;
    this.userEmail = userEmail;
  }

  @Override
  public Class<? extends JobRequestHandler<SendOrderTrackingEmailJob>> getJobRequestHandler() {
    return SendOrderTrackingEmailJobHandler.class;
  }
}
