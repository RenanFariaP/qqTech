import React from "react";

function transactionLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="h-full w-full">
      {children}
    </div>
  );
}

export default transactionLayout;
