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
import { Method } from "@/types/method";
import { Transaction } from "@/types/transaction";
import Select from "react-select";
import makeAnimated from "react-select/animated";

interface SelectOptions<T> {
  value: T;
  label: string;
}

interface ModuleCreateForm {
  name: string;
  description: string;
  TAG: string;
}

const ModuleManagement = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleList, setModuleList] = useState<ListItem<Module>[]>([]);
  const [methodOptions, setMethodOptions] = useState<SelectOptions<Method>[]>(
    []
  );
  const [methodSelectedOption, setMethodSelectedOption] = useState<
    [SelectOptions<Method>] | null
  >(null);
  const [transactionOptions, setTransactionOptions] = useState<
    SelectOptions<Transaction>[]
  >([]);
  const [transactionSelectedOption, setTransactionSelectedOption] = useState<
    [SelectOptions<Transaction>] | null
  >(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const [formData, setFormData] = useState<ModuleCreateForm>({
    name: "",
    description: "",
    TAG: "",
  });

  const handleChange = (_name: keyof ModuleCreateForm, _value: any) => {
    setFormData((prev) => ({ ...prev, [_name]: _value }));
  };

  const handleMethodSelectChange = (methodSelectedOption: any) => {
    setMethodSelectedOption(methodSelectedOption);
  };

  const handleTransactionSelectChange = (transactionSelectedOption: any) => {
    setTransactionSelectedOption(transactionSelectedOption);
  };

  const formatMethodOptions = (data: Method[]): SelectOptions<Method>[] => {
    const options: SelectOptions<Method>[] = data.map((method) => ({
      value: method,
      label: method.name,
    }));
    return options;
  };

  const formatTransactionOptions = (
    data: Transaction[]
  ): SelectOptions<Transaction>[] => {
    const options: SelectOptions<Transaction>[] = data.map((transaction) => ({
      value: transaction,
      label: transaction.name,
    }));
    return options;
  };

  const formatModules = (data: Module[]): ListItem<Module>[] => {
    return data.map((module) => {
      const cols: ListColumn<Module>[] = [
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
    formData.name = "";
    formData.description = "";
    formData.TAG = "";
    setMethodSelectedOption(null);
    setTransactionSelectedOption(null);
  };

  const fetchModuleList = async () => {
    try {
      const response = await axios.get<Module[]>(
        "http://localhost:8000/dashboard/module"
      );
      const { data } = response;
      const formatted = formatModules(data);
      setModules(data);
      setModuleList(formatted);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };

  const fetchMethodList = async () => {
    try {
      const response = await axios.get<Method[]>(
        `http://localhost:8000/dashboard/method/`
      );
      const { data } = response;
      const formatted = formatMethodOptions(data);
      setMethodOptions(formatted);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };

  const fetchTransactionList = async () => {
    try {
      const response = await axios.get<Transaction[]>(
        `http://localhost:8000/dashboard/transaction/`
      );
      const { data } = response;
      const formatted = formatTransactionOptions(data);
      setTransactionOptions(formatted);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/dashboard/module/${id}`
      );
      Notify("success", "Módulo deletado com sucesso!");
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    } finally {
      fetchModuleList();
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const selectedMethods: number[] = [];
    if (methodSelectedOption) {
      methodSelectedOption.forEach((method) => {
        selectedMethods.push(method.value.id);
      });
    }

    const selectedTransactions: number[] = [];
    if (transactionSelectedOption){
      transactionSelectedOption.forEach((transaction) => {
        selectedTransactions.push(transaction.value.id);
      });
    }
    try {
      const form = {
        name: formData.name,
        description: formData.description,
        TAG: formData.TAG,
        methods: selectedMethods,
        transactions: selectedTransactions,
      };
      const response = await axios.post(
        "http://localhost:8000/dashboard/module",
        form
      );
      Notify("success", "Módulo cadastrado com sucesso!");
      formData.name = "";
      formData.description = "";
      formData.TAG = "";
      setTransactionSelectedOption(null);
      setMethodSelectedOption(null);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify("error", message);
    } finally {
      fetchModuleList();
    }
  };

  const onFilterChange = (value: string) => {
    const filteredModules = modules.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.tag.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setModuleList(formatModules(filteredModules));
  };

  useEffect(() => {
    fetchModuleList();
    fetchMethodList();
    fetchTransactionList();
    }, []);

    const animatedComponents = makeAnimated();
    return (
      <div className="flex flex-col p-10 gap-5 w-full h-full">
        <ToastContainer />
        {isRegistering ? (
          <>
            <div className="flex gap-16 items-center justify-between">
              <h1 className="font-bold lg:text-xl text-lg">Gerenciamento de módulo</h1>
              <GenericButton
                onClick={handleRegister}
                text="Voltar"
                icon={Icon.return}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <h1></h1>
              <TextInput
                label="Nome do módulo"
                type="text"
                name="name"
                isRequired={true}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <TextArea
                label="do módulo"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <TextInput
                label="TAG"
                type="text"
                name="TAG"
                isRequired={true}
                value={formData.TAG}
                onChange={(e) => handleChange("TAG", e.target.value)}
              />
              <div className="flex flex-col mt-5">
                <Select
                  className="w-80"
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  defaultValue={[]}
                  isMulti={true}
                  name="options"
                  options={methodOptions}
                  onChange={handleMethodSelectChange}
                  value={methodSelectedOption}
                />
              </div>
              <div className="flex flex-col mt-5">
                <Select
                  className="w-80"
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  defaultValue={[]}
                  isMulti={true}
                  name="options"
                  options={transactionOptions}
                  onChange={handleTransactionSelectChange}
                  value={transactionSelectedOption}
                />
              </div>
              <ButtonInput label="Enviar" onSubmit={() => handleSubmit} />
            </form>
          </>
        ) : (
          <>
            <div className="flex gap-16 items-center justify-between">
              <h1 className="font-bold lg:text-xl text-lg">Gerenciamento de módulo</h1>
              <GenericButton
                onClick={handleRegister}
                text="Novo módulo"
                icon={Icon.add}
              />
            </div>
            <List
              data={moduleList}
              onFilterChange={onFilterChange}
              onDelete={(value) => handleDelete(value.id)}
              listEntity="o módulo"
              searchPlaceHolder="módulo (Nome, TAG ou descrição)"
              entityType="module"
            />
          </>
        )}
      </div>
    );
};

export default ModuleManagement;
