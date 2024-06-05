import React, { ChangeEventHandler, useEffect, useState } from "react";
import addIcon from "../../public/assets/svg/addIcon.svg";
import revealPassword from "../../public/assets/svg/revealPassword.svg";
import Image from "next/image";

type Input = {
  label: string;
  type: string;
  name: string;
  isRequired: boolean;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  bgColor?: string;
};

export enum Icon {
  reveal = "reveal",
}

const TextInput = ({
  label,
  type,
  name,
  isRequired,
  value,
  onChange,
  bgColor = "white",
}: Input) => {
  const [showPassword, setShowPassword] = useState(type);

  enum Icon{
    reveal= "reveal"
  };

  const iconMap: Record<Icon, string> = {
    reveal: revealPassword,
  };

  const handleChange = ()=>{
    if(showPassword === 'password'){
      setShowPassword('text');
    } else {
      setShowPassword('password')
    }
  }

  if (type === "password") {
    return (
      <div className="flex flex-col">
        <label className="mt-5">{label}</label>
        <div className="flex gap-3">
          <input
            type={showPassword}
            name={name}
            required={isRequired}
            className={`rounded-md w-80 h-10 outline-none p-5 bg-${bgColor}`}
            value={value}
            onChange={onChange}
          /> 
          <Image onClick={handleChange} className="ml-[-42px] cursor-pointer" src={iconMap.reveal} alt="Exibir senha" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <label className="mt-5">{label}</label>
      <input
        type={type}
        name={name}
        required={isRequired}
        className={`rounded-md w-80 h-10 outline-none p-5 bg-${bgColor}`}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TextInput;
