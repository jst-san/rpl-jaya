import React from "react";

export default function Wrapper({
  children,
  outerClass,
  innerClass,
}: {
  children?: React.ReactNode;
  outerClass?: string;
  innerClass?: string;
}) {
  return (
    <div className={`p-6 ${outerClass}`}>
      <div className={`max-w-7xl mx-auto ${innerClass}`}>{children}</div>
    </div>
  );
}
