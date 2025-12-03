package com.example.vietsneaker_server.file;

import static java.lang.System.currentTimeMillis;

import io.micrometer.common.lang.NonNull;
import io.micrometer.common.util.StringUtils;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.vietsneaker_server.config.ApplicationProperties;

@RequiredArgsConstructor
@Service
@Log4j2
public class FileStorageServiceImpl implements FileStorageService {

  private final ApplicationProperties applicationProperties;

  public String saveFile(@NonNull MultipartFile file, @NonNull String relativePath) {

    final String filePath = applicationProperties.getUploadPath() + File.separator + relativePath;
    if (!createFolderIfNotExist(applicationProperties.getUploadPath())) {
      log.info("Unable create upload folder");
      return null;
    }
    Path targetPath = Paths.get(filePath);
    try {
      Files.write(targetPath, file.getBytes());
      return relativePath;
    } catch (IOException e) {
      log.error("Unable to save upload file");
      // TODO Auto-generated catch block
      e.printStackTrace();
      return null;
    }
  }

  public String saveFile(@NonNull MultipartFile file) {
    String fileExtension = getFileExtension(file.getOriginalFilename());
    String subPath = currentTimeMillis() + "." + fileExtension;
    return saveFile(file, subPath);
  }

  /**
   * @param path
   * @return createdOrExists: false if can not create folder
   */
  private boolean createFolderIfNotExist(String path) {

    File folder = new File(path);
    if (!folder.exists()) {
      boolean folderCreated = folder.mkdirs();
      return folderCreated;
    }
    return true;
  }

  private String getFileExtension(String filename) {
    if (filename == null || filename.isEmpty()) {
      return "";
    }
    int lastDotIdx = filename.lastIndexOf(".");
    return filename.substring(lastDotIdx + 1).toLowerCase();
  }

  public byte[] readFileFromLocation(String fileUrl) {
    if (StringUtils.isBlank(fileUrl)) {
      return null;
    }

    try {
      Path filePath =
          new File(applicationProperties.getUploadPath() + File.separator + fileUrl).toPath();
      return Files.readAllBytes(filePath);

    } catch (IOException e) {
      // TODO Auto-generated catch block
      log.info("Unable to read file from path {}", fileUrl);
      e.printStackTrace();
      return null;
    }
  }
}
