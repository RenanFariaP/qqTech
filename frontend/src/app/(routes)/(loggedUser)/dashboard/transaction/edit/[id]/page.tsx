"use client";

import { Icon } from "@/components/genericButton";
import React, { FormEvent, useEffect, useState } from "react";
import TextInput from "@/components/textInput";
import ButtonInput from "@/components/buttonInput";
import GenericButton from "@/components/genericButton";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { useRouter } from "next/navigation";
import { Transaction } from "@/types/transaction";
import TextArea from "@/components/textArea";

interface TransactionUpdateForm {
  name: string;
  description: string;
  TAG: string;
}

interface GetTransactionForm {
  name: string;
  description: string;
  TAG: string;
}

const TransactionUpdate = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [entityID, setEntityID] = useState<number>();
  const [formData, setFormData] = useState<TransactionUpdateForm>({
    name: "",
    description: "",
    TAG: "",
  });
  const [getTransactionForm, setGetTransactionForm] = useState<GetTransactionForm>({
    name: "",
    description: "",
    TAG: "",
  });

  const handleChange = (_name: keyof TransactionUpdateForm, _value: any) => {
    setGetTransactionForm((prev) => ({ ...prev, [_name]: _value }));
  };

  const handleGetTransaction = async (id: number) => {
    try {
      const response = await axios.get<Transaction>(
        `http://localhost:8000/dashboard/transaction/${id}`
      );
      const transactionDetails = {
        name: response.data.name,
        description: response.data.description,
        TAG: response.data.TAG,
      };
      setGetTransactionForm(transactionDetails);
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
            name: getTransactionForm.name,
            description: getTransactionForm.description,
            TAG: getTransactionForm.TAG
          };
      const response = await axios.put(
        `http://localhost:8000/dashboard/transaction/${entityID}`,
        form
      );
      Notify("success", "Transação atualizada com sucesso!");
      setTimeout(()=>router.replace('/dashboard/transaction'), 3000);
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
    handleGetTransaction(id);
  }, [params.id]);

  const animatedComponents = makeAnimated();
  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <ToastContainer />
      <div className="flex gap-16 items-center justify-between">
        <h1 className="font-bold lg:text-xl text-lg">
          Gerenciamento de usuário
        </h1>
        <GenericButton
          onClick={() => router.push("/dashboard/transaction")}
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
          value={getTransactionForm.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextArea label="da transação" name="description" value={getTransactionForm.description} onChange={(e) => handleChange("description", e.target.value)}/>
        <TextInput
          label="TAG"
          type="text"
          name="TAG"
          isRequired={true}
          value={getTransactionForm.TAG}
          onChange={(e) => handleChange("TAG", e.target.value)}
        />
        <ButtonInput label="Enviar" onSubmit={() => {}} />
      </form>
    </div>
  );
};

export default TransactionUpdate;
