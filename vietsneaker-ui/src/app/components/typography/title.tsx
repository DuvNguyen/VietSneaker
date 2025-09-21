import { ReactNode } from "react";

function Title({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return <p className={`text-2xl font-bold  ${className}`}>{children}</p>;
}

export default Title;
