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
import React, { FormEvent, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

interface ProfileCreateForm {
  name: string;
  description: string;
}

const ProfileManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [listProfiles, setListProfiles] = useState<ListItem<Profile>[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [profileList, setProfileList] = useState<ListItem<Profile>[]>([]);
  const [formData, setFormData] = useState<ProfileCreateForm>({
    name: "",
    description: ""
  });

  const handleChange = (_name: keyof ProfileCreateForm, _value: any) => {
    setFormData((prev) => ({ ...prev, [_name]: _value }));
  };

  const formatProfiles = (data: Profile[]): ListItem<Profile>[] => {
    return data.map((profile) => {
      const cols: ListColumn<Profile>[] = [
        {
          value: profile.name,
        },
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
  };

  const fetchProfileList = async () => {
    try {
      const response = await axios.get<Profile[]>(
        "http://localhost:8000/dashboard/profile"
      );
      const { data } = response;
      console.log(data);
      const formatted = formatProfiles(data);
      setProfiles(data);
      setProfileList(formatted);
    } catch (error) {
      console.error("Erro ao listar os perfis:", error);
    }
  };

  const handleDelete = async(id: number | string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/dashboard/profile/${id}`);
    } catch (error) {
      console.error("Erro ao deletar o módulo:", error);
    } finally {
      fetchProfileList();
    }
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const form = {
        name: formData.name,
        description: formData.description,
      };
      const response = await axios.post(
        "http://localhost:8000/dashboard/profile",
        form
      );
      Notify('success', 'Perfil cadastrado com sucesso!');
      formData.name = "";
      formData.description = "";
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
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
    setListProfiles(formatProfiles(filteredProfiles));
  };

  useEffect(() => {
    fetchProfileList();
  }, []);

  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <ToastContainer />
      {isRegistering ? (
        <>
        <div className="flex gap-16 items-center justify-between">
          <h1 className="font-bold text-xl">Gerenciamento de perfil</h1>
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
            <TextArea label="do perfil" name="description" value={formData.description} onChange={(e) => handleChange("description", e.target.value)}/>
            <ButtonInput label="Enviar" onSubmit={() => handleSubmit} />
          </form>
        </>
      ) : (
        <>
        <div className="flex gap-16 items-center justify-between">
          <h1 className="font-bold text-xl">Gerenciamento de perfil</h1>
          <GenericButton
            onClick={handleRegister}
            text="Cadastrar novo perfil"
            icon={Icon.add}
          />
        </div>
        <List
            data={profileList}
            onFilterChange={onFilterChange}
            onSeeMore={() => {}}
            onDelete={(value) => handleDelete(value.id)}
            listEntity="o perfil"
          />
        </>
      )}
    </div>
  );
};

export default ProfileManagement;


