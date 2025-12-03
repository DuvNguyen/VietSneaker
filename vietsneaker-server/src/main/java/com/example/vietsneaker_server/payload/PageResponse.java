package com.example.vietsneaker_server.payload;

import java.util.List;
import lombok.Getter;
import org.springframework.data.domain.Page;

import com.example.vietsneaker_server.util.Client;

/** PageResponse Decomposition of {@link Page} */
@Getter
@Client
public class PageResponse<T> {

  // Current page
  private final int page;

  // Maxium of element in page
  private final int size;

  private final long totalElements;
  private final int totalPages;
  private final List<T> content;
  private boolean first;
  private boolean last;
  private boolean empty;

  public PageResponse(int page, int size, long totalElements, int totalPages, List<T> data) {
    this.page = page;
    this.size = size;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
    this.content = data;
  }

  /** Convert built-in page result to application standard page result */
  public PageResponse(Page<T> page) {
    this.page = page.getNumber();
    this.size = page.getSize();
    this.totalElements = page.getTotalElements();
    this.totalPages = page.getTotalPages();
    this.content = page.getContent();
    this.last = page.isLast();
    this.first = page.isFirst();
    this.empty = page.isEmpty();
  }

  /** Build page result from list of DTO entity and original page information */
  public PageResponse(List<T> dtos, Page<?> pageInfo) {
    this.page = pageInfo.getNumber();
    this.size = pageInfo.getSize();
    this.totalElements = pageInfo.getTotalElements();
    this.totalPages = pageInfo.getTotalPages();
    this.content = dtos;
    this.last = pageInfo.isLast();
    this.first = pageInfo.isFirst();
    this.empty = pageInfo.isEmpty();
  }
}
