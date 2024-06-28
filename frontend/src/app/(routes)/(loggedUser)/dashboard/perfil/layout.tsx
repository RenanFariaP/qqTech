import React from "react";

function ProfileLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="h-full w-full">
      {children}
    </div>
  );
}

export default ProfileLayout;
