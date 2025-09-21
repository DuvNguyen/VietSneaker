"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  /* eslint-disable */
  page: any;
  setPage: (page: number) => void;
}

/**
 * Control url search param when user navigate page
 * Example of param: brand?page=5
 */
const PageController = ({ page, setPage }: PaginationControlsProps) => {
  // react hook to work with router, search param and current url path
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Get current page from url param
  const pageNumber = Number(searchParams.get("page") ?? "1");

  /**
   * Handle move to next page, update url param
   */
  function handleNext(): void {
    changePage(pageNumber + 1);
  }

  const isFirst = () => {
    return page.page == 1;
  };
  const isLast = () => {
    return page.page >= Number(page.totalPages);
  };

  /**
   * Handle move back previous page, update url param
   */
  function hanlePrevious(): void {
    if (pageNumber <= 0) {
      return;
    }
    changePage(pageNumber - 1);
  }

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.has("page")) {
      params.set("page", String(page));
    } else {
      params.append("page", String(page));
    }
    setPage(page);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col flex-end">
        <div className="flex gap-2 p-5">
          <div className="join">
            <button
              disabled={page.first}
              className="join-item btn"
              onClick={hanlePrevious}
            >
              «
            </button>
            <button className="join-item btn">Page {pageNumber ?? 0}</button>
            <button
              disabled={page.last}
              className="join-item btn"
              onClick={handleNext}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageController;
