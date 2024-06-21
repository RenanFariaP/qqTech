"use client"

import ButtonInput from "@/components/buttonInput";
import TextInput from "@/components/textInput";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#F2F2F2] flex flex-col items-center shadow-md w-96 rounded-md pb-10">
      <p className="bg-[#418713] py-5 px-8 w-full text-white [text-shadow:_1px_1px_rgba(53,16,56,0.5)] [border-radius:_6px_6px_0_0]">Login</p>
      <div>
        <TextInput label="Usuário" type="email" name="email" isRequired={true} value={email} onChange={handleEmailChange} bgColor="zinc-300"/>
      </div>
      <div>
        <TextInput label="Senha" type="password" name="password" isRequired={true} value={password} onChange={handlePasswordChange} bgColor="zinc-300"/>
      </div>
      <div>
        <ButtonInput label="Entrar" onSubmit={()=>{}}/>
      </div>
      <Link href="/recover_password" className="hover:underline">Esqueceu a senha?</Link>
    </form>
  );
}
