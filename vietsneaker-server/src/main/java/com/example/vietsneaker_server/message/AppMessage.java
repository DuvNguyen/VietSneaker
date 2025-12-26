package com.example.vietsneaker_server.message;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.EnumMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

/**
 * Class quản lý thông báo lỗi/thành công.
 * Đã sửa để chạy an toàn trên Docker (Read-only mode).
 */
public class AppMessage {

  private static final Logger logger = LoggerFactory.getLogger(AppMessage.class);
  private static final Map<MessageKey, String> messages = new EnumMap<>(MessageKey.class);

  // Tên file cấu hình (Đặt cứng ở đây cho an toàn, thay vì gọi Bean trong static block)
  private static final String MESSAGES_FILE = "messages.csv";

  static {
    loadMessages();
  }

  public static String of(MessageKey key) {
    // Nếu tìm thấy thì trả về message, không thì trả về tên Enum
    return messages.getOrDefault(key, key.name());
  }

  private static void loadMessages() {
    try {
      // 1. Dùng ClassPathResource để lấy file từ trong JAR (An toàn cho Docker)
      ClassPathResource resource = new ClassPathResource(MESSAGES_FILE);
      
      if (!resource.exists()) {
        logger.error("CRITICAL: Không tìm thấy file {} trong resources! Sử dụng tên Enum mặc định.", MESSAGES_FILE);
        return; // Không ném lỗi để tránh sập App, chỉ log lỗi thôi
      }

      // 2. Đọc file
      try (BufferedReader reader = new BufferedReader(
          new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
        
        String line;
        while ((line = reader.readLine()) != null) {
          // Bỏ qua dòng trống hoặc comment (nếu cần)
          if (line.trim().isEmpty()) continue;

          String[] parts = line.split(",", 2);
          if (parts.length == 2) {
            try {
              String appMsg = parts[0].trim();
              String businessMsg = parts[1].trim();
              
              // Map từ String trong CSV sang Enum
              MessageKey messageKey = MessageKey.valueOf(appMsg);
              messages.put(messageKey, businessMsg);
              
            } catch (IllegalArgumentException e) {
              logger.warn("Ignoring invalid message key in CSV: {}", line);
            }
          }
        }
      }
      
      logger.info("Successfully loaded messages from {}", MESSAGES_FILE);
      
      // --- QUAN TRỌNG: ĐÃ XÓA PHẦN GHI FILE (BufferedWriter) ---
      // Lý do: Trên Docker chạy file .jar là Read-Only, cố ghi file sẽ gây lỗi 500 Crashing App.
      
    } catch (Exception e) {
      // Catch tất cả lỗi để App vẫn khởi động được, chỉ log error ra console
      logger.error("Failed to load messages from CSV", e);
    }
  }
}