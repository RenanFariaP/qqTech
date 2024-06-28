"use client";

import List, { ListColumn, ListItem } from "@/components/list";
import { Module } from "@/types/module";
import React, { FormEvent, useEffect, useState } from "react";
import GenericButton, { Icon } from "@/components/genericButton";
import { ToastContainer } from "react-toastify";
import TextInput from "@/components/textInput";
import TextArea from "@/components/textArea";
import ButtonInput from "@/components/buttonInput";
import axios from "axios";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";

interface ModuleCreateForm {
  name: string;
  description: string;
  TAG: string;
}

const ModuleManagement = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleList, setModuleList] = useState<ListItem<Module>[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const [formData, setFormData] = useState<ModuleCreateForm>({
    name: "",
    description: "",
    TAG: ""
  });

  const handleChange = (_name: keyof ModuleCreateForm, _value: any) => {
    setFormData((prev)=>({...prev, [_name]: _value }));
  };

  const formatModules = (data: Module[]): ListItem<Module>[] => {
    return data.map((module) => {
      const cols: ListColumn<Module>[] = [
        {
          value: module.name,
        },
        {
          value: module.description,
        },
        {
          value: module.tag,
        },
      ];
      return {
        value: module,
        uniqueIdentifier: module.id,
        cols,
        label: module.name,
      };
    });
  };

  const handleRegister = () => {
    setIsRegistering(!isRegistering);
  };

  const fetchModuleList = async ()=>{
    try {
      const response = await axios.get<Module[]>("http://localhost:8000/dashboard/module");
      const {data} = response;
      const formatted = formatModules(data);
      setModules(data);
      console.log(data)
      setModuleList(formatted);
    } catch (error) {
      console.error("Erro ao listar os módulos:", error);
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
      const response = await axios.post("http://localhost:8000/dashboard/module", form);
      Notify('success', 'Módulo cadastrado com sucesso!');
      console.log("Resposta do servidor:", response.data);
      formData.name = "";
      formData.description = "";
      formData.TAG = "";
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    } finally {
      fetchModuleList();
    }
  };

  const handleDelete = async(id: number | string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/dashboard/module/${id}`);
    } catch (error) {
      console.error("Erro ao deletar o módulo:", error);
    } finally {
      fetchModuleList();
    }
  };

  const onFilterChange = (value: string) => {
    const filteredModules = modules.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setModuleList(formatModules(filteredModules));
  };

  useEffect(() => {
    fetchModuleList();
  }, []);

  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <ToastContainer />
      {isRegistering ? (
        <>
        <div className="flex gap-16 items-center justify-between">
          <h1 className="font-bold text-xl">Gerenciamento de Módulo</h1>
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
            <h1 className="font-bold text-xl">Gerenciamento de Módulo</h1>
            <GenericButton
              onClick={handleRegister}
              text="Cadastrar novo módulo"
              icon={Icon.add}
            />
          </div>
          <List
          data={moduleList}
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

export default ModuleManagement;
