import * as React from "react";

interface Props {
  width?: number;
  height?: number;
  strokeLg?: string;
  strokeMb?: string;
}

function UserSvg({width = 24, height = 24, strokeLg = "#418713", strokeMb = "#FFF"}: Props) {
  return (
    <>
      <div className="bg-white p-3 rounded-full lg:block hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeLg}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
          <circle cx={12} cy={7} r={4} />
        </svg>
      </div>
      <div className="block lg:hidden p-3 rounded-full bg-[#418713]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeMb}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
          <circle cx={12} cy={7} r={4} />
        </svg>
      </div>
    </>
  );
}

export default UserSvg;
