import React from "react";

const RegisterButton = ({ text, onRegister }: { text: string, onRegister?: () =>void }) => {
  return (
    <button onClick={onRegister} className="flex justify-center items-center text-white font-bold bg-[#418713] px-3 py-2 rounded-md gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
      Novo(a) {text}
    </button>
  );
};

export default RegisterButton;
