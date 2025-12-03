package com.example.vietsneaker_server.jobs.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jobrunr.jobs.lambdas.JobRequest;
import org.jobrunr.jobs.lambdas.JobRequestHandler;

import com.example.vietsneaker_server.jobs.handler.SendWelcomeEmailJobHandler;

/** SendWelcomeEmailJob */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SendWelcomeEmailJob implements JobRequest {
  private Long userId;

  @Override
  public Class<? extends JobRequestHandler<SendWelcomeEmailJob>> getJobRequestHandler() {
    return SendWelcomeEmailJobHandler.class;
  }
}
