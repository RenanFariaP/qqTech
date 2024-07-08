"use client";

import { Icon } from "@/components/genericButton";
import React, { FormEvent, useEffect, useState } from "react";
import TextInput from "@/components/textInput";
import ButtonInput from "@/components/buttonInput";
import GenericButton from "@/components/genericButton";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { ToastContainer } from "react-toastify";

import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { useRouter } from "next/navigation";
import { Method } from "@/types/method";
import TextArea from "@/components/textArea";

interface MethodUpdateForm {
  name: string;
  description: string;
  TAG: string;
}

interface GetMethodForm {
  name: string;
  description: string;
  TAG: string;
}

const MethodUpdate = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [entityID, setEntityID] = useState<number>();
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState<MethodUpdateForm>({
    name: "",
    description: "",
    TAG: "",
  });
  const [getMethodForm, setGetMethodForm] = useState<GetMethodForm>({
    name: "",
    description: "",
    TAG: "",
  });

  const handleChange = (_name: keyof MethodUpdateForm, _value: any) => {
    setGetMethodForm((prev) => ({ ...prev, [_name]: _value }));
  };

  const handleGetMethod = async (id: number) => {
    try {
      const response = await axios.get<Method>(
        `http://localhost:8000/dashboard/method/${id}`
      );
      const methodDetails = {
        name: response.data.name,
        description: response.data.description,
        TAG: response.data.TAG,
      };
      setGetMethodForm(methodDetails);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify("error", message);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
        const form = {
            name: getMethodForm.name,
            description: getMethodForm.description,
            TAG: getMethodForm.TAG
          };
      const response = await axios.put(
        `http://localhost:8000/dashboard/method/${entityID}`,
        form
      );
      Notify("success", "Função atualizada com sucesso!");
      setDisabled(true);
      setTimeout(()=>router.replace('/dashboard/method'), 3000);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify("error", message);
    }
  };

  useEffect(() => {
    if (!params.id) {
      return;
    }
    const id = parseInt(params.id);
    setEntityID(id);
    handleGetMethod(id);
  }, [params.id]);

  const animatedComponents = makeAnimated();
  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <ToastContainer />
      <div className="flex gap-16 items-center justify-between">
        <h1 className="font-bold lg:text-xl text-lg">
          Gerenciamento de Função
        </h1>
        <GenericButton
          onClick={() => router.push("/dashboard/method")}
          text="Voltar"
          icon={Icon.return}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <h1></h1>
        <TextInput
          label="Nome da transação"
          type="text"
          name="name"
          isRequired={true}
          value={getMethodForm.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextArea label="da transação" name="description" value={getMethodForm.description} onChange={(e) => handleChange("description", e.target.value)}/>
        <TextInput
          label="TAG"
          type="text"
          name="TAG"
          isRequired={true}
          value={getMethodForm.TAG}
          onChange={(e) => handleChange("TAG", e.target.value)}
        />
        {disabled ? (
          <div>
            <button type='submit' className='flex justify-center items-center bg-zinc-400 py-2 px-7 rounded-md text-white my-5 shadow-sm' disabled>Enviar</button>
          </div>
        ) : (
          <ButtonInput label="Enviar" onSubmit={() => {}}/>
        )}
      </form>
    </div>
  );
};

export default MethodUpdate;
