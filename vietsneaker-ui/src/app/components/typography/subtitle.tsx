import { ReactNode } from "react";

function Subtitle({
  styleClass,
  children,
}: {
  styleClass: string;
  children: ReactNode;
}) {
  return (
    <div className={`text-4xl pt-2 pb-4 font-semibold ${styleClass}`}>
      {children}
    </div>
  );
}

export default Subtitle;
