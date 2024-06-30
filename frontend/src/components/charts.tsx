import React from "react";
import IconButton, { Icon } from "./iconButton";
import { useRouter } from "next/navigation";
import path from "path";

interface Props {
  title: string;
  value: number | null;
  path: string;
}

const Charts = ({ title, value, path }: Props) => {
  const router = useRouter();
  return (
    <div className="w-80 h-28 bg-white flex items-center shadow-md [box-sizing:border-box]">
      <div className="h-full w-28 bg-[#418713] flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={30}
          height={30}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
          <circle cx={12} cy={7} r={4} />
        </svg>
      </div>
      <div className="flex flex-col px-3 py-2 h-full w-full">
        <div className="flex-1">
          <div className="text-lg">{title}</div>
          <div className="text-base">{value}</div>
        </div>
        <div
          className="text-sm flex justify-end cursor-pointer hover:text-zinc-500"
          onClick={() => {
            router.push(`/dashboard/${path}`);
          }}
        >
          Ver mais
        </div>
      </div>
    </div>
  );
};

export default Charts;
