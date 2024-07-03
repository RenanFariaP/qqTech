import Image from "next/image";
import React from "react";
import addIcon from "../../public/assets/svg/addIcon.svg";
import returnIcon from "../../public/assets/svg/returnIcon.svg";
import editIcon from "../../public/assets/svg/editIcon.svg"

export enum Icon {
  add = "add",
  return = "return",
  edit = "edit"
}

const iconMap: Record<Icon, string> = {
  add: addIcon,
  return: returnIcon,
  edit: editIcon
};

interface Props {
  text: string;
  icon: Icon;
  onClick: () => void;
  width?: string;
}

const GenericButton = ({ text, icon, onClick,width="auto" }: Props) => {
  return (
    <button
      onClick={onClick}
      style={{width: width}}
      className="flex justify-center items-center text-white font-bold bg-[#418713] px-3 py-2 rounded-md gap-2"
    >
      <Image
        src={iconMap[icon]}
        width={24}
        height={24}
        alt={`Icone de ${icon}`}
      />
      <p className="">{text}</p>
    </button>
  );
};

export default GenericButton;
