import React from "react";

function moduleLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="h-full w-full">
      {children}
    </div>
  );
}

export default moduleLayout;
