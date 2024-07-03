"use client";

import { ListItem } from "@/components/list";
import { Icon } from "@/components/genericButton";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import TextInput from "@/components/textInput";
import ButtonInput from "@/components/buttonInput";
import GenericButton from "@/components/genericButton";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { Method } from "@/types/method";
import { ToastContainer } from "react-toastify";

import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { useRouter } from "next/navigation";
import { ModuleInfos } from "@/types/infos/moduleInfos";
import TextArea from "@/components/textArea";
import { MethodInfos } from "@/types/infos/methodInfos";
import { TransactionInfos } from "@/types/infos/transactionInfos";

interface ModuleUpdateForm {
  name: string;
  description: string;
  TAG: "";
}

interface GetModuleForm {
  name: string;
  description: string;
  TAG: string;
}

interface SelectOptions<T> {
  value: T;
  label: string;
}

const ModuleUpdate = ({ params }: { params: { id: string } }) => {
  const [methodOptions, setMethodOptions] = useState<SelectOptions<MethodInfos>[]>([]);
  const [methodSelectedOption, setMethodSelectedOption] = useState<SelectOptions<MethodInfos>[]>([]);
  const [transactionOptions, setTransactionOptions] = useState<SelectOptions<TransactionInfos>[]>([]);
  const [transactionSelectedOption, setTransactionSelectedOption] = useState<SelectOptions<TransactionInfos>[]>([]);
  
  const transactionUnselectedOptions:SelectOptions<TransactionInfos>[] = useMemo(()=>{
    const selectedOptionsIds = transactionSelectedOption.map((transaction)=>{
      return transaction.value.id;
    });
    const result = transactionOptions.filter((transaction)=>{
      return !selectedOptionsIds.includes(transaction.value.id);
    })
    return result;
  },[transactionSelectedOption, transactionOptions]);

  const methodUnselectedOptions:SelectOptions<MethodInfos>[] = useMemo(()=>{
    const selectedOptionsIds = methodSelectedOption.map((method)=>{
      return method.value.id;
    });
    const result = methodOptions.filter((method)=>{
      return !selectedOptionsIds.includes(method.value.id);
    })
    return result;
  },[methodSelectedOption, methodOptions]);


  const [entityID, setEntityID] = useState<number>();

  const router = useRouter();

  const [getModuleForm, setGetModuleForm] = useState<GetModuleForm>({
    name: "",
    description: "",
    TAG: "",
  });

  const handleChange = (_name: keyof ModuleUpdateForm, _value: any) => {
    setGetModuleForm((prev) => ({ ...prev, [_name]: _value }));
  };

  const handleSelectMethodChange = (methodSelectedOption: any) => {
    setMethodSelectedOption(methodSelectedOption);
  };

  const handleSelectTransactionChange = (transactionSelectedOption: any) => {
    setTransactionSelectedOption(transactionSelectedOption);
  };

  const formatMethodOptions = (
    data: MethodInfos[]
  ): SelectOptions<MethodInfos>[] => {
    const options: SelectOptions<MethodInfos>[] = data.map((method) => ({
      value: method,
      label: method.name,
    }));
    return options;
  };

  const formatTransactionOptions = (
    data: TransactionInfos[]
  ): SelectOptions<TransactionInfos>[] => {
    const options: SelectOptions<TransactionInfos>[] = data.map(
      (transaction) => ({
        value: transaction,
        label: transaction.name,
      })
    );
    return options;
  };

  const formatSelectedMethods = (
    data: MethodInfos[]
  ): SelectOptions<MethodInfos>[] => {
    const options: SelectOptions<MethodInfos>[] = data.map((method) => ({
      value: method,
      label: method.name,
    }));
    return options;
  };

  const formatSelectedTransactions = (
    data: TransactionInfos[]
  ): SelectOptions<TransactionInfos>[] => {
    const options: SelectOptions<TransactionInfos>[] = data.map(
      (transaction) => ({
        value: transaction,
        label: transaction.name,
      })
    );
    return options;
  };

  const fetchMethodList = async () => {
    try {
      const response = await axios.get<MethodInfos[]>(
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
      const response = await axios.get<TransactionInfos[]>(
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

  const handleGetModule = async (id: number) => {
    try {
      const response = await axios.get<ModuleInfos>(
        `http://localhost:8000/dashboard/module/${id}`
      );
      const moduleDetails = {
        name: response.data.name,
        description: response.data.description,
        TAG: response.data.TAG,
        methods: response.data.methods,
        transactions: response.data.transactions
      };
      if (response.data.methods) {
        setMethodSelectedOption(formatSelectedMethods(response.data.methods));
      }
      if (response.data.transactions) {
        setTransactionSelectedOption(
          formatSelectedTransactions(response.data.transactions)
        );
      }
      setGetModuleForm(moduleDetails);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify("error", message);
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
    if (transactionSelectedOption) {
      transactionSelectedOption.forEach((transaction) => {
        selectedTransactions.push(transaction.value.id);
      });
    }

    try {
      const form = {
        name: getModuleForm.name,
        description: getModuleForm.description,
        TAG: getModuleForm.TAG,
        methods: selectedMethods,
        transactions: selectedTransactions,
      };
      const response = await axios.put(
        `http://localhost:8000/dashboard/module/${entityID}`,
        form
      );
      Notify("success", "Módulo atualizado com sucesso!");
      getModuleForm.name = "";
      getModuleForm.description = "";
      getModuleForm.TAG = "";
      setMethodSelectedOption([]);
      setTransactionSelectedOption([]);
      setTimeout(()=>router.replace('/dashboard/module'), 3000);
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
    fetchMethodList();
    fetchTransactionList();
    handleGetModule(id);
  }, [params.id]);

  const animatedComponents = makeAnimated();
  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <ToastContainer />
      <div className="flex gap-16 items-center justify-between">
        <h1 className="font-bold lg:text-xl text-lg">
          Gerenciamento de Perfil
        </h1>
        <GenericButton
          onClick={() => router.push("/dashboard/module")}
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
          value={getModuleForm.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextArea
          label="do perfil"
          name="description"
          value={getModuleForm.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <div className="flex flex-col mt-5">
          <Select
            className="w-80"
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[]}
            isMulti={true}
            name="options"
            options={methodUnselectedOptions}
            onChange={handleSelectMethodChange}
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
            options={transactionUnselectedOptions}
            onChange={handleSelectTransactionChange}
            value={transactionSelectedOption}
          />
        </div>
        <ButtonInput label="Enviar" onSubmit={() => {}} />
      </form>
    </div>
  );
};

export default ModuleUpdate;
