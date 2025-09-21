import { ReactNode } from "react";

/**
 * Custom react component wrap text for more information details
 *
 */
function HelperText({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return <div className={`text-slate-400 ${className}`}>{children}</div>;
}

export default HelperText;
