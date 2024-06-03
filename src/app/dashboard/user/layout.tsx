import React from "react";

function userLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
}

export default userLayout;
