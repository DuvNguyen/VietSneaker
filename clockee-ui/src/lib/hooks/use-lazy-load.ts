"use client";

import { PageResponse } from "@/gen/backend";
import { logger } from "@/util/logger";
import { useEffect, useState } from "react";

type useSelectProps<T> = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  fetchData: (page: number, query: string) => Promise<any>;
};

export const useLazyPage = <T>({ fetchData }: useSelectProps<T>) => {
  const [pageInfo, setPageInfo] = useState<PageResponse<T>>();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const initFetch = async () => {
      try {
        setPage(0);
        const res = await fetchData(page, query);
        setPageInfo(res);
      } catch (error) {
        logger.warn(error);
      }
    };
    initFetch();
  }, [query]);
  const fetchMore = async () => {
    if (!pageInfo) {
      return;
    }
    if (!pageInfo.last) {
      const currentPage = page;
      setPage((prev) => prev + 1);
      const res = await fetchData(currentPage + 1, query);
      const totalElement = Array.from(
        new Set([...(pageInfo.content || []), ...(res.content || [])]),
      );
      // Append previous result with current result
      setPageInfo({
        ...res,
        content: [...totalElement],
      });
    }
  };

  return {
    fetchMore,
    setQuery,
    query,
    pageInfo,
  };
};
