package com.example.clockee_server.file;

import lombok.NonNull;
import org.springframework.web.multipart.MultipartFile;

/** FilteStorageService */
public interface FileStorageService {

  /**
   * @return byte[] stream of file data from upload path or return null if read file fail
   */
  public byte[] readFileFromLocation(String fileUrl);

  /**
   * @param file source file to save to server
   * @return filePath if success else null
   */
  public String saveFile(@NonNull MultipartFile file);

  public String saveFile(@NonNull MultipartFile file, @NonNull String relativePath);
}
