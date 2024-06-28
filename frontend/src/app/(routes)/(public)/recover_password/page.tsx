"use client"
import ButtonInput from "@/components/buttonInput";
import GenericButton, { Icon } from "@/components/genericButton";
import TextInput from "@/components/textInput";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log(email);
    
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="w-full">
      <div className="absolute top-28 right-3">
        <GenericButton
          onClick={() => router.replace("/login")}
          text="Voltar"
          icon={Icon.return}
        />
      </div>
      <form onSubmit={handleSubmit} className="bg-[#F2F2F2] flex flex-col items-center shadow-md w-96 rounded-md pb-5">
        <p className="bg-[#418713] py-5 px-8 w-full text-white [text-shadow:_1px_1px_rgba(53,16,56,0.5)] [border-radius:_6px_6px_0_0]">
          Recuperar senha
        </p>
        <p className="text-justify px-8 pt-5">
          Utilize o e-mail cadastrado para recuperar sua senha, para onde enviaremos sua senha!
        </p>
        <div>
          <TextInput label="E-mail" type="email" isRequired name="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <ButtonInput label="Enviar" />
        </div>
      </form>
    </div>
  );
};

export default page;
