import React from "react";
import { useRouter } from "next/navigation";
import userIcon from "../../public/assets/svg/userIcon.svg"
import profileIcon from "../../public/assets/svg/profileIcon.svg"
import moduleIcon from "../../public/assets/svg/moduleIcon.svg"
import transactionIcon from "../../public/assets/svg/transactionIcon.svg"
import methodIcon from "../../public/assets/svg/methodIcon.svg"
import Image from "next/image";

export enum Icon{
  user = 'user',
  profile = 'profile',
  module = 'module',
  transaction = 'transaction',
  method = 'method',
}

const iconMap: Record<Icon, string> = {
  user: userIcon,
  profile: profileIcon,
  module: moduleIcon,
  transaction: transactionIcon,
  method: methodIcon,
}

interface Props {
  title: string;
  value: number | null;
  path: string;
  icon: Icon;
}

const Charts = ({ title, value, path, icon }: Props) => {
  const router = useRouter();
  return (
    <div className="w-80 h-28 bg-white flex items-center shadow-md [box-sizing:border-box]">
      <div className="h-full w-28 bg-[#418713] flex items-center justify-center">
        <Image src={iconMap[icon]} width={24} height={24} alt={`Icone de ${icon}`} />
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
