import React from "react";

function transactionLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex w-full">
      <div>{children}</div>
    </div>
  );
}

export default transactionLayout;
