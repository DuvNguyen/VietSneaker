import React, { ReactNode } from "react";

type ThumbnailProps = {
  children?: ReactNode;
  className?: string;
};

export const Thumbnail = ({
  className = "w-14 h-14 skeleton",
  children,
}: ThumbnailProps) => {
  return (
    <div className="avatar">
      <div className={`mask mask-squircle ${className}`}>{children}</div>
    </div>
  );
};

export default Thumbnail;
