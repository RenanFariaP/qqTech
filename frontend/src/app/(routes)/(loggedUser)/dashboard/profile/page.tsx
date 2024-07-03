"use client";

import ButtonInput from "@/components/buttonInput";
import GenericButton, { Icon } from "@/components/genericButton";
import List, { ListColumn, ListItem } from "@/components/list";
import TextArea from "@/components/textArea";
import TextInput from "@/components/textInput";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { Profile } from "@/types/profile";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import React, { FormEvent, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Module } from "@/types/module";

interface ProfileCreateForm {
  name: string;
  description: string;
}

interface SelectOptions<T> {
  value: T;
  label: string;
}

const ProfileManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profileList, setProfileList] = useState<ListItem<Profile>[]>([]);
  const [moduleOptions, setModuleOptions] = useState<SelectOptions<Module>[]>([]);
  const [moduleSelectedOption, setModuleSelectedOption] = useState<[SelectOptions<Module>]| null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState<ProfileCreateForm>({
    name: "",
    description: ""
  });

  const handleChange = (_name: keyof ProfileCreateForm, _value: any) => {
    setFormData((prev) => ({ ...prev, [_name]: _value }));
  };

  const handleSelectChange = (moduleSelectedOption: any) => {
    setModuleSelectedOption(moduleSelectedOption);
  };

  const formatModuleOptions = (data: Module[]): SelectOptions<Module>[] => {
    const options: SelectOptions<Module>[] = data.map((module) => ({
      value: module,
      label: module.name,
    }));
    return options;
  };

  const formatProfiles = (data: Profile[]): ListItem<Profile>[] => {
    return data.map((profile) => {
      const cols: ListColumn<Profile>[] = [
        {
          value: profile.description,
        },
      ];
      return {
        value: profile,
        uniqueIdentifier: profile.id,
        cols,
        label: profile.name,
      };
    });
  };

  const handleRegister = () => {
    setIsRegistering(!isRegistering);
    formData.name = "";
    formData.description = "";
    setModuleSelectedOption(null);
  };

  const fetchProfileList = async () => {
    try {
      const response = await axios.get<Profile[]>(
        "http://localhost:8000/dashboard/profile"
      );
      const { data } = response;
      const formatted = formatProfiles(data);
      setProfiles(data);
      setProfileList(formatted);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };

  const fetchModuleList = async () => {
    try {
      const response = await axios.get<Module[]>(
        `http://localhost:8000/dashboard/module/`
      );
      const { data } = response;
      const formatted = formatModuleOptions(data);
      setModuleOptions(formatted);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/dashboard/profile/${id}`
      );
      Notify("success", "Perfil deletado com sucesso!");
    } catch (error) {
      Notify("error", "Não foi possível deletar o Perfil!");
    } finally {
      fetchProfileList();
    }
  };

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
        name: formData.name,
        description: formData.description,
        modules: selectedModules
      };
      const response = await axios.post(
        "http://localhost:8000/dashboard/profile",
        form
      );
      Notify("success", "Perfil cadastrado com sucesso!");
      formData.name = "";
      formData.description = "";
      setModuleSelectedOption(null);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify("error", message);
    } finally {
      fetchProfileList();
    }
  };

  const onFilterChange = (value: string) => {
    const filteredProfiles = profiles.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setProfileList(formatProfiles(filteredProfiles));
  };

  useEffect(() => {
    fetchProfileList();
    fetchModuleList();
  }, []);

  const animatedComponents = makeAnimated();
  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <ToastContainer />
      {isRegistering ? (
        <>
          <div className="flex gap-16 items-center justify-between">
            <h1 className="font-bold lg:text-xl text-lg">Gerenciamento de perfil</h1>
            <GenericButton
              onClick={handleRegister}
              text="Voltar"
              icon={Icon.return}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <h1></h1>
            <TextInput
              label="Nome do perfil"
              type="text"
              name="name"
              isRequired={true}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <TextArea
              label="do perfil"
              name="description"
              value={formData.description}
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
                options={moduleOptions}
                onChange={handleSelectChange}
                value={moduleSelectedOption}
              />
            </div>
            <ButtonInput label="Enviar" onSubmit={() => handleSubmit} />
          </form>
        </>
      ) : (
        <>
          <div className="flex gap-16 items-center justify-between">
            <h1 className="font-bold lg:text-xl text-lg">Gerenciamento de perfil</h1>
            <GenericButton
              onClick={handleRegister}
              text="Novo perfil"
              icon={Icon.add}
            />
          </div>
          <List
            data={profileList}
            onFilterChange={onFilterChange}
            onDelete={(value) => handleDelete(value.id)}
            listEntity="o perfil"
            searchPlaceHolder="perfil (Nome ou descrição)"
            entityType="profile"
          />
        </>
      )}
    </div>
  );
};

export default ProfileManagement;
