package com.example.clockee_server.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.clockee_server.common.AbstractIntegrationTest;
import com.example.clockee_server.config.ApplicationConstants;
import com.example.clockee_server.controller.admin.AdminBrandController;
import com.example.clockee_server.entity.Brand;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

/** AdminBrandControllerTest {@link AdminBrandController} */
public class AdminBrandControllerTest extends AbstractIntegrationTest {

  private Brand brandRequest;

  private ObjectMapper objectMapper;

  @BeforeEach
  private void init() {
    brandRequest = new Brand();
    brandRequest.setName("Tisco");
    objectMapper = new ObjectMapper();
  }

  @Test
  @WithMockUser(username = "test_user", roles = ApplicationConstants._PRODUCT_ADMIN)
  public void getProductWithAppropriateRole_success() throws Exception {
    mockMvc.perform(get("/admin/brands").secure(true)).andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "test_user")
  public void createProductWithoutRole_farl() throws Exception {
    String requestBody = objectMapper.writeValueAsString(brandRequest);
    mockMvc
        .perform(
            post("/admin/brands")
                .secure(true)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(requestBody))
        .andExpect(status().isUnauthorized());
  }
}
