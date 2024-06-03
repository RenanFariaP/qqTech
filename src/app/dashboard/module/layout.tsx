import React from "react";

function moduleLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex w-full">
      <div>{children}</div>
    </div>
  );
}

export default moduleLayout;
