"use client";
import { logger } from "@/util/logger";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const initialPage = 1;
type usePageSearchProps = {
  fetchData: () => void;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  dependencies?: Array<any>;
};
export const usePageSearch = <T>({
  fetchData,
  dependencies = [],
}: usePageSearchProps) => {
  const [query, setQuery] = useState<string>("");
  const usePageProps = usePage<T>({
    fetchData,
    dependencies: [...dependencies, query],
  });

  return {
    query,
    setQuery,
    ...usePageProps,
  };
};

type usePageProps = {
  fetchData: () => void;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  dependencies?: Array<any>;
};

/**
 * @param fetchPageInfo: handler function to refresh the page content
 * @param dependencies: list of dependencies array ’cause refresh page info
 */
export const usePage = <T>({ fetchData, dependencies = [] }: usePageProps) => {
  const params = useSearchParams();
  const [page, setPage] = useState(Number(params.get("page")) || initialPage);
  const [pageInfo, setPageInfo] = useState<T>({} as T);

  useEffect(() => {
    fetchData();
  }, [page, ...dependencies]);

  return {
    pageInfo,
    page,
    setPageInfo,
    setPage,
  };
};
