import * as React from "react";

function UserSvg() {
  return (
    <div className="bg-white p-3 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#418713"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-user"
      >
        <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
        <circle cx={12} cy={7} r={4} />
      </svg>
    </div>
  );
}

export default UserSvg;
