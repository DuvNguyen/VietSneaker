// import React, { ReactNode } from "react";

// type ThumbnailProps = {
//   children?: ReactNode;
//   className?: string;
// };

// export const Thumbnail = ({
//   className = "w-14 h-14 skeleton",
//   children,
// }: ThumbnailProps) => {
//   return (
//     <div className="avatar">
//       <div className={`${className}`}>{children}</div>
//     </div>
//   );
// };

// export default Thumbnail;

// common/thumbnail.tsx
import React, { ReactNode } from "react";

type ThumbnailProps = {
  children?: ReactNode;
  className?: string;
};

export const Thumbnail = ({ className = "", children }: ThumbnailProps) => {
  return (
    <div className={`overflow-hidden rounded-none bg-white ${className}`}>
      {children}
    </div>
  );
};

export default Thumbnail;
