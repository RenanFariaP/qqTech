import React from "react";

function functionLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="h-full w-full">
      {children}
    </div>
  );
}

export default functionLayout;
