import React, { ChangeEventHandler } from "react";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  bgColor?: string;
}

const TextArea = ({label, name, value, onChange, bgColor="white"}:Props) => {
  return (
    <div className="flex flex-col">
      <label className="mt-5">Descrição {label}</label>
      <textarea
        maxLength={255}
        name={name}
        className={`rounded-md w-80 h-40 outline-none p-5 bg-${bgColor}`}
        value={value}
        onChange={onChange}
      />
    </div>
  )
};

export default TextArea;
