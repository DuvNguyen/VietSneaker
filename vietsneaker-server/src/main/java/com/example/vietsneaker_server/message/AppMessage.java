package com.example.vietsneaker_server.message;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.vietsneaker_server.config.ApplicationProperties;
import com.example.vietsneaker_server.util.ApplicationContextProvider;

/**
 * TODO: change to MessageSource for i18n AppMessage Centralize application message with csv file -
 * application prorperties ${app.messages-file} This class provide helper method to get message from
 * this config file You have to provide new message in {@link MessageKey} and provide semantic
 * message ${app.messages-file}
 */
public class AppMessage {

  // Enum map is better for enum lookup
  private static final Map<MessageKey, String> messages = new EnumMap<>(MessageKey.class);

  private static final Set<MessageKey> missingKeys = new HashSet<>();

  // Init loading message to map as cache
  static {
    loadMessages();
  }

  /**
   * In this ${app.messages-file} content may be RESOURCE_NOT_FOUND,Resource is not found
   *
   * <p>Usage: AppMessage.of(MessageKey.RESOURCE_NOT_FOUND)
   *
   * @param key the message key (enum)
   * @return the corresponding message, or the enum name if missing
   */
  public static String of(MessageKey key) {
    return messages.getOrDefault(key, key.name());
  }

  private static void loadMessages() {

    Logger logger = LoggerFactory.getLogger(AppMessage.class);
    ApplicationProperties applicationProperties =
        ApplicationContextProvider.bean(ApplicationProperties.class);
    String messagesFile = applicationProperties.getMessagesFile();

    // Using outer try for close resource automatically
    try (BufferedReader reader =
        new BufferedReader(
            new InputStreamReader(
                AppMessage.class.getClassLoader().getResourceAsStream(messagesFile),
                StandardCharsets.UTF_8))) {
      String line;

      // Read message from csv file as 2 part
      while ((line = reader.readLine()) != null) {
        String[] parts = line.split(",", 2);
        if (parts.length == 2) {
          try {
            String appMsg = parts[0].trim();
            String businessMsg = parts[1].trim();
            MessageKey messageKey = MessageKey.valueOf(appMsg);

            messages.put(messageKey, businessMsg);
          } catch (IllegalArgumentException e) {
            logger.info("Ignoring invalid message key: {}", line);
          }
        }
      }

      // Default message as enum key when it not define in csv

      // Write to csv file missing key
      try (BufferedWriter writer =
          new BufferedWriter(
              new FileWriter(
                  new File(AppMessage.class.getClassLoader().getResource(messagesFile).toURI()),
                  true))) {

        for (MessageKey key : MessageKey.values()) {
          if (!messages.containsKey(key)) {

            missingKeys.add(key);
            // Use message key enum name as default name
            messages.put(key, key.name());

            // Write append to csv message storeage file
            writer.write(key.name() + "," + key.name());
            writer.newLine();
          }
        }

      } catch (IOException e) {
        System.err.println("Unable to write missing application message: " + e.getMessage());
      }

      logger.info("Load application message from file {}", messagesFile);

    } catch (Exception e) {
      throw new RuntimeException("Failed to load messages from CSV", e);
    }
  }
}
