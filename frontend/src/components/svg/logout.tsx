import * as React from "react";

function LogoutSvg() {
  return (
    <>
      <div className="bg-white p-3 rounded-full lg:block hidden">
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
        >
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <path d="M16 17L21 12 16 7" />
          <path d="M21 12L9 12" />
        </svg>
      </div>
      <div className="block lg:hidden p-3 rounded-full bg-[#418713]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <path d="M16 17L21 12 16 7" />
          <path d="M21 12L9 12" />
        </svg>
      </div>
    </>
  );
}

export default LogoutSvg;
