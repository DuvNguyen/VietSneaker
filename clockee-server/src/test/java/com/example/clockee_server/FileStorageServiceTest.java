package com.example.clockee_server;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.lenient;

import com.example.clockee_server.common.AbstractIntegrationTest;
import com.example.clockee_server.config.ApplicationProperties;
import com.example.clockee_server.file.FileStorageServiceImpl;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.web.multipart.MultipartFile;

/** FileStorageServiceTest */
public class FileStorageServiceTest extends AbstractIntegrationTest {
  @Mock private ApplicationProperties applicationProperties;

  @InjectMocks private FileStorageServiceImpl fileStorageService;

  @Mock private MultipartFile multipartFile;
  private String uploadDir;

  @BeforeEach
  void setUp() {
    lenient().when(applicationProperties.getUploadPath()).thenReturn("target/test-uploads");
    uploadDir = applicationProperties.getUploadPath(); // "target/test-uploads"
    try {
      Files.createDirectories(Paths.get(uploadDir));
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @Test
  void readFileFromLocation_success() throws IOException {
    // Arrange

    String fileName = "testfile.txt";
    Path filePath = Paths.get(uploadDir, fileName);

    byte[] expectedContent = "Hello, World!".getBytes();
    Files.write(filePath, expectedContent);

    // Act
    byte[] result = fileStorageService.readFileFromLocation(fileName);

    // Assert
    assertNotNull(result);
    assertArrayEquals(expectedContent, result);

    // Cleanup
    Files.deleteIfExists(filePath);
  }

  @Test
  void readFileFromLocation_fail() {
    String invalidFileUrl = "nonexistent/file.txt";
    byte[] result = fileStorageService.readFileFromLocation(invalidFileUrl);
    assertNull(result);
  }
}
