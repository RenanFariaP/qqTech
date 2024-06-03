import React from "react";

function ProfileLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex w-full">
      <div>{children}</div>
    </div>
  );
}

export default ProfileLayout;
