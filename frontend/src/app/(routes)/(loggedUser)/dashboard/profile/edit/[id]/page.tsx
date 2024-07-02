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
import { ToastContainer } from "react-toastify";

import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { useRouter } from "next/navigation";
import { ProfileInfos } from "@/types/infos/profileInfos";
import TextArea from "@/components/textArea";
import { ModuleInfos } from "@/types/infos/moduleInfos";

interface ProfileUpdateForm {
  name: string;
  description: string;
}

interface GetProfileForm {
  name: string;
  description: string;
  }

interface SelectOptions<T> {
  value: T;
  label: string;
}

const ProfileUpdate = ({ params }: { params: { id: string } }) => {
  const [moduleOptions, setModuleOptions] = useState<SelectOptions<ModuleInfos>[]>([]);
  const [moduleSelectedOption, setModuleSelectedOption] =useState<SelectOptions<ModuleInfos>[]>([]);
  const [entityID, setEntityID] = useState<number>();

  const moduleUnselectedOptions:SelectOptions<ModuleInfos>[] = useMemo(()=>{
    const selectedOptionsIds = moduleSelectedOption.map((module)=>{
      return module.value.id;
    });
    const result = moduleOptions.filter((module)=>{
      return !selectedOptionsIds.includes(module.value.id);
    })
    return result;
  },[moduleSelectedOption, moduleOptions]);

  const router = useRouter();

  const [getProfileForm,  setGetProfileForm] = useState<GetProfileForm>({
    name: "",
    description: ""
  });

  const handleChange = (_name: keyof ProfileUpdateForm, _value: any) => {
    setGetProfileForm((prev) => ({ ...prev, [_name]: _value }));
  };

  const handleSelectChange = (moduleSelectedOption: any) => {
    setModuleSelectedOption(moduleSelectedOption);
  };

  const formatModuleOptions = (data: ModuleInfos[]): SelectOptions<ModuleInfos>[] => {
    const options: SelectOptions<ModuleInfos>[] = data.map((module) => ({
      value: module,
      label: module.name,
    }));
    return options;
  };

  const formatSelectedModules = (data: ModuleInfos[]): SelectOptions<ModuleInfos>[] => {
    const options: SelectOptions<ModuleInfos>[] = data.map((module) => ({
      value: module,
      label: module.name,
    }));
    return options;
  };


  const fetchModuleList = async () => {
    try {
      const response = await axios.get<ModuleInfos[]>(
        `http://localhost:8000/dashboard/module/`
      );
      const { data } = response;
      const formatted = formatModuleOptions(data);
      setModuleOptions(formatted);
    } catch (error) {
      Notify('error', 'Não foi possível listar os módulos cadastrados!');
    }
  };

  const handleGetProfile = async (id: number) =>{
    try {
        const response = await axios.get<ProfileInfos>(`http://localhost:8000/dashboard/profile/${id}`)
        const profileDetails = {
            name: response.data.name,
            description: response.data.description,
            modules: response.data.modules
        }
        if(response.data.modules){
          setModuleSelectedOption(formatSelectedModules(response.data.modules));
        }
        setGetProfileForm(profileDetails);
        console.log(profileDetails);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify("error", message);
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const selectedModules: number[] = [];
    if(moduleSelectedOption){
      moduleSelectedOption.forEach(module => {
        selectedModules.push(module.value.id)
      });
    };
    try {
      const form = {
        name: getProfileForm.name,
        description: getProfileForm.description,
        modules: selectedModules
      };
      console.log(form);
      const response = await axios.put(
        `http://localhost:8000/dashboard/profile/${entityID}`,
        form
      );
      Notify('success', 'Módulo atualizado com sucesso!')
      getProfileForm.name= "";
      getProfileForm.description = "";
      setModuleSelectedOption([]);
      setTimeout(()=>router.replace('/dashboard/profile'), 3000);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    } 
  };

  useEffect(() => {
    if(!params.id){
      return;
    };
    const id = parseInt(params.id);
    setEntityID(id);
    fetchModuleList();
    handleGetProfile(id);
  }, [params.id]);

  const animatedComponents = makeAnimated();
  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <ToastContainer />
      <div className="flex gap-16 items-center justify-between">
        <h1 className="font-bold lg:text-xl text-lg">
          Gerenciamento de Perfil
        </h1>
        <GenericButton onClick={() => router.push('/dashboard/profile')} text="Voltar" icon={Icon.return} />
      </div>
      <form onSubmit={handleSubmit}>
        <h1></h1>
        <TextInput
          label="Nome do perfil"
          type="text"
          name="name"
          isRequired={true}
          value={getProfileForm.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextArea
                label="do perfil"
                name="description"
                value={getProfileForm.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
        <div className="flex flex-col mt-5">
          <Select
                className="w-80"
                closeMenuOnSelect={true}
                components={animatedComponents}
                defaultValue={[]}
                isMulti={true}
                name="options"
                options={moduleUnselectedOptions}
                onChange={handleSelectChange}
                value={moduleSelectedOption}
              />
        </div>
        <ButtonInput label="Enviar" onSubmit={() => {}} />
      </form>
    </div>
  );
};

export default ProfileUpdate;
