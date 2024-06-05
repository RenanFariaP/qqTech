import Image from "next/image";
import React from "react";
import addIcon from "../../public/assets/svg/addIcon.svg";
import returnIcon from "../../public/assets/svg/returnIcon.svg";

export enum Icon{
  add = 'add',
  return = 'return',
}

const iconMap: Record<Icon, string> = {
  add: addIcon,
  return: returnIcon,
}

interface Props {
  text: string;
  icon: Icon;
  onClick: ()=>void;
}

const GenericButton = ({ text, icon, onClick }: Props) => {
  return (
    <button onClick={onClick} className="flex justify-center items-center text-white font-bold bg-[#418713] px-3 py-2 rounded-md gap-2 w-auto">
      <Image src={iconMap[icon]} width={24} height={24} alt={`Icone de ${icon}`} />
      {text}
    </button>
  );
};

export default GenericButton;
