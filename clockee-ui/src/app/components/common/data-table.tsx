import React, { ReactNode } from "react";
/**
 * Display list of resource
 */
type DataTableProps<T> = {
  data: T[];
  emptyMessage?: string;
  headers: string[];
  renderRow: (item: T, index: number) => ReactNode;
};
const DataTable = <T,>({
  data,
  emptyMessage = "Không có dữ liệu",
  headers = [],
  renderRow,
}: DataTableProps<T>) => {
  if (!data || data.length === 0) {
    return <p className="text-lg">{emptyMessage}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item, index) => renderRow(item, index))}</tbody>
      </table>
    </div>

    // <div className="overflow-x-auto table w-full text-center mt-2">
    //   <table className="table w-100% border-separate border-spacing-0">
    //     <thead className="text-xl text-black text-center px-4 py-3">
    //       <tr >
    //         {headers.map((header, index) => (
    //           <th className={`border-2 border-gray-200 px-4 border-y-4 py-3 bg-[#FFD700] ${index === 0 ? "rounded-tl-xl  border-l-4" : ""}`}key={index}>{header}</th>
    //         ))}
    //         <th className=" rounded-tr-xl border-2 border-y-4 border-r-4 border-gray-200 px-4 py-3 bg-[#FFD700]" colSpan={2}>Hành động</th>
    //       </tr>
    //     </thead>
    //     <tbody>{data.map((item, index) => renderRow(item, index))}</tbody>
    //   </table>
    // </div>
  );
};

export default DataTable;
