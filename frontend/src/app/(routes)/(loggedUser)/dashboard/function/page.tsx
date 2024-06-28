"use client";

import List, { ListColumn, ListItem } from "@/components/list";
import { Method } from "@/types/method";
import React, { FormEvent, useEffect, useState } from "react";
import GenericButton, { Icon } from "@/components/genericButton";
import TextInput from "@/components/textInput";
import TextArea from "@/components/textArea";
import axios from "axios";
import ButtonInput from "@/components/buttonInput";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";

interface MethodCreateForm {
  name: string;
  description: string;
  TAG: string;
}

const FunctionManagement = () => {
  const [methods, setMethods] = useState<Method[]>([]);
  const [methodList, setMethodList] = useState<ListItem<Method>[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const [formData, setFormData] = useState<MethodCreateForm>({
    name: "",
    description: "",
    TAG: ""
  });

  const handleChange = (_name: keyof MethodCreateForm, _value: any) => {
    setFormData((prev)=>({...prev, [_name]: _value }));
  };

  const formatMethods = (data: Method[]): ListItem<Method>[] => {
    return data.map((method) => {
      const cols: ListColumn<Method>[] = [
        {
          value: method.name,
        },
        {
          value: method.description,
        },
        {
          value: method.TAG,
        },
      ];
      return {
        value: method,
        uniqueIdentifier: method.id,
        cols,
        label: method.name,
      };
    });
  };

  const handleRegister = () => {
    setIsRegistering(!isRegistering);
  };

  const handleDelete = async(id: number | string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/dashboard/method/${id}`);
    } catch (error) {
      console.error("Erro ao deletar a transação:", error);
    } finally {
      fetchMethodList();
    }
  };

  const fetchMethodList = async ()=>{
    try {
      const response = await axios.get<Method[]>("http://localhost:8000/dashboard/method");
      const {data} = response;
      const formatted = formatMethods(data);
      setMethods(data);
      console.log(data)
      setMethodList(formatted);
    } catch (error) {
      console.error("Erro ao listar as funções:", error);
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const form = {
        name: formData.name,
        description: formData.description,
        TAG: formData.TAG
      }
      console.log(form)
      const response = await axios.post("http://localhost:8000/dashboard/method", form);
      Notify('success', 'Perfil cadastrado com sucesso!');
      formData.name = "";
      formData.description = "";
      formData.TAG = "";
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    } finally{
      fetchMethodList();
    }
  };

  const onFilterChange = (value: string) => {
    const filteredMethods = methods.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setMethodList(formatMethods(filteredMethods));
  };

  useEffect(() => {
    const fetchMethods = () => {
    };
    fetchMethodList();
    fetchMethods();
  }, []);

  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      {isRegistering ? (
        <>
        <div className="flex gap-16 items-center justify-between">
          <h1 className="font-bold text-xl">Gerenciamento de Função</h1>
          <GenericButton
            onClick={handleRegister}
            text="Voltar"
            icon={Icon.return}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <h1></h1>
          <TextInput
            label="Nome da função"
            type="text"
            name="name"
            isRequired={true}
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextArea label="da função" name="description" value={formData.description} onChange={(e) => handleChange("description", e.target.value)}/>
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
            <h1 className="font-bold text-xl">Gerenciamento de Função</h1>
            <GenericButton
              onClick={handleRegister}
              text="Cadastrar nova função"
              icon={Icon.add}
            />
          </div>
          <List
          data={methodList}
          onFilterChange={onFilterChange}
          onSeeMore={() => {}}
          onDelete={(value) => handleDelete(value.id)}
          listEntity="a função"
        />
        </>
      )}
      </div>
  );
}

export default FunctionManagement;
