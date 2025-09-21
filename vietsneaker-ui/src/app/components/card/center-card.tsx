import React from "react";

type CenterCardProps = {
  children: React.ReactNode;
  className?: string;
};

const CenterCard: React.FC<CenterCardProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`py-20 mx-auto max-w-7xl ${className}`}>{children}</div>
  );
};

export default CenterCard;
