"use client";

import List, { ListColumn, ListItem } from "@/components/list";
import React, { FormEvent, useEffect, useState } from "react";
import { Transaction } from "@/types/transaction";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import GenericButton, { Icon } from "@/components/genericButton";
import TextInput from "@/components/textInput";
import TextArea from "@/components/textArea";
import ButtonInput from "@/components/buttonInput";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";

interface TransactionCreateForm {
  name: string;
  description: string;
  TAG: string;
}

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionList, setTransactionList] = useState<ListItem<Transaction>[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const [formData, setFormData] = useState<TransactionCreateForm>({
    name: "",
    description: "",
    TAG: ""
  });

  const handleChange = (_name: keyof TransactionCreateForm, _value: any) => {
    setFormData((prev)=>({...prev, [_name]: _value }));
  };

  const formatTransactions = (data: Transaction[]): ListItem<Transaction>[] => {
    return data.map((transaction) => {
      const cols: ListColumn<Transaction>[] = [
        {
          value: transaction.name,
        },
        {
          value: transaction.description,
        },
        {
          value: transaction.TAG,
        },
      ];
      return {
        value: transaction,
        uniqueIdentifier: transaction.id,
        cols,
        label: transaction.name,
      };
    });
  };

  const handleRegister = () => {
    setIsRegistering(!isRegistering);
  };
  
  const fetchTransactionList = async ()=>{
    try {
      const response = await axios.get<Transaction[]>("http://localhost:8000/dashboard/transaction");
      const {data} = response;
      const formatted = formatTransactions(data);
      setTransactions(data);
      console.log(data)
      setTransactionList(formatted);
    } catch (error) {
      console.error("Erro ao listar as funções:", error);
    }
  };

  const handleDelete = async(id: number | string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/dashboard/transaction/${id}`);
    } catch (error) {
      console.error("Erro ao deletar a transação:", error);
    } finally {
      fetchTransactionList();
    }
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const form = {
        name: formData.name,
        description: formData.description,
        TAG: formData.TAG
      }
      const response = await axios.post("http://localhost:8000/dashboard/transaction", form);
      Notify('success', 'Transação cadastrada com sucesso!');
      console.log("Resposta do servidor:", response.data);
      formData.name = "";
      formData.description = "";
      formData.TAG = "";
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    } finally {
      fetchTransactionList();
    }
  };

  const onFilterChange = (value: string) => {
    const filteredTransactions = transactions.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setTransactionList(formatTransactions(filteredTransactions));
  };

  useEffect(() => {
    fetchTransactionList();
  }, []);

  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <ToastContainer />
      {isRegistering ? (
        <>
        <div className="flex gap-16 items-center justify-between">
          <h1 className="font-bold text-xl">Gerenciamento de Transação</h1>
          <GenericButton
            onClick={handleRegister}
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
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextArea label="da transação" name="description" value={formData.description} onChange={(e) => handleChange("description", e.target.value)}/>
          <TextInput
            label="TAG"
            type="text"
            name="TAG"
            isRequired={true}
            value={formData.TAG}
            onChange={(e) => handleChange("TAG", e.target.value)}
          />
          <ButtonInput label="Enviar" onSubmit={() => handleSubmit} />
        </form>
      </>
      ):(
        <>
          <div className="flex gap-16 items-center justify-between">
            <h1 className="font-bold text-xl">Gerenciamento de Transação</h1>
            <GenericButton
              onClick={handleRegister}
              text="Cadastrar nova transação"
              icon={Icon.add}
            />
          </div>
          <List
          data={transactionList}
          onFilterChange={onFilterChange}
          onSeeMore={() => {}}
          onDelete={(value) => handleDelete(value.id)}
          listEntity="a função"
        />
        </>
      )}
      </div>
  );
};

export default TransactionManagement;
