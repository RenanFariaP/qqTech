"use client"
import ButtonInput from "@/components/buttonInput";
import GenericButton, { Icon } from "@/components/genericButton";
import TextInput from "@/components/textInput";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";

interface ResponseData {
    data: {
      message: string
    }
  }

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if(newPassword != newPasswordConfirmation){
      Notify('error', "As senhas não estão iguais!");
      return;
    }
    const form = {
      email: email,
      token: token,
      newPassword: newPassword
    }
    try {
      const response = await axios.post('http://localhost:8000/password-reset/verify', form);
      Notify('success', response.data.message)
      setEmail('');
      setToken('');
      setNewPassword('');
      setTimeout(()=>{router.push('/login')}, 3000);
    } catch (error) {
        const e = error as Error;
        const message = e.response.data.detail;
        Notify('error', message)
    }
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="absolute top-28 right-3">
        <GenericButton
          onClick={() => router.replace("/recover_password")}
          text="Voltar"
          icon={Icon.return}
        />
      </div>
      <form onSubmit={handleSubmit} className="bg-[#F2F2F2] flex flex-col items-center shadow-md w-96 rounded-md pb-5">
        <p className="bg-[#418713] py-5 px-8 w-full text-white [text-shadow:_1px_1px_rgba(53,16,56,0.5)] [border-radius:_6px_6px_0_0]">
          Crie uma nova senha
        </p>
        <div>
          <TextInput label="E-mail" type="email" isRequired name="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div>
          <TextInput label="PIN" type="text" isRequired name="token" value={token} onChange={(e)=>setToken(e.target.value)} />
        </div>
        <div>
          <TextInput label="Nova senha" type="password" isRequired name="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
        </div>
        <div>
          <TextInput label="Confirme a senha" type="password" isRequired name="password" value={newPasswordConfirmation} onChange={(e)=>setNewPasswordConfirmation(e.target.value)} />
        </div>
        <div>
          <ButtonInput label="Enviar" />
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
