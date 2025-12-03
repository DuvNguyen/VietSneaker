package com.example.vietsneaker_server.mapper;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;

import com.example.vietsneaker_server.payload.PageResponse;
import com.example.vietsneaker_server.util.ApplicationContextProvider;

/**
 * Helper class to convert between jpa entity and dto Support convert object, list, page With page
 * convert use custom paginate is @see PageResponse
 */
public class MapperUtil {
  private static final ModelMapper modelMapper = ApplicationContextProvider.bean(ModelMapper.class);

  public static <S, D> D mapObject(S source, Class<D> destinationType) {
    return modelMapper.map(source, destinationType);
  }

  public static <S, D> List<D> mapList(Collection<S> sourceList, Function<S, D> converter) {
    return sourceList.stream().map(converter).collect(Collectors.toList());
  }

  public static <S, D> Set<D> mapSet(Collection<S> sourceList, Function<S, D> converter) {
    return sourceList.stream().map(converter).collect(Collectors.toSet());
  }

  /*
   * Convert entity page to custom dto page
   */
  public static <S, D> PageResponse<D> mapPageResponse(
      Page<S> sourcePage, Class<D> destinationType) {

    var targetList =
        sourcePage.getContent().stream()
            .map(source -> modelMapper.map(source, destinationType))
            .collect(Collectors.toList());
    return new PageResponse<D>(targetList, sourcePage);
  }

  public static <S, D> PageResponse<D> mapPageResponse(
      Page<S> sourcePage, Function<S, D> converter) {

    List<D> targetList =
        sourcePage.getContent().stream().map(converter).collect(Collectors.toList());
    return new PageResponse<D>(targetList, sourcePage);
  }
}
