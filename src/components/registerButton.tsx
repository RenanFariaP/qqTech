import Image from "next/image";
import React from "react";
import addIcon from "../../public/assets/svg/addIcon.svg"

const RegisterButton = ({ text, onRegister }: { text: string, onRegister?
  : () =>void }) => {
  return (
    <button onClick={onRegister} className="flex justify-center items-center text-white font-bold bg-[#418713] px-3 py-2 rounded-md gap-2">
      <Image src={addIcon} width={24} height={24} alt="Adicionar" />
      Novo(a) {text}
    </button>
  );
};

export default RegisterButton;
