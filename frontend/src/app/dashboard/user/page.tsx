"use client";

import List, { ListColumn, ListItem } from "@/components/list";
import { Icon } from "@/components/genericButton";
import React, { FormEvent, useEffect, useState } from "react";
import { User, UserWithRelation } from "@/types/user";
import TextInput from "@/components/textInput";
import ButtonInput from "@/components/buttonInput";
import GenericButton from "@/components/genericButton";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { Profile } from "@/types/profile";
import { ToastContainer } from "react-toastify";
import { Error } from "@/types/error";
import { notify } from "@/components/toast";

interface UserCreateForm {
  username: string;
  email: string;
  registration: string;
  password: string;
}

interface SelectOptions<T> {
  value: T;
  label: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRelation[]>([]);
  const [profileOptions, setProfileOptions] = useState<
    SelectOptions<Profile>[]
  >([]);
  const [userList, setUserList] = useState<ListItem<User>[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const [selectedOption, setSelectedOption] =
    useState<SelectOptions<Profile> | null>(null);
  const [formData, setFormData] = useState<UserCreateForm>({
    username: "",
    email: "",
    registration: "",
    password: "",
  });


  const handleChange = (_name: keyof UserCreateForm, _value: any) => {
    setFormData((prev) => ({ ...prev, [_name]: _value }));
  };

  const handleSelectChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  const formatProfileOptions = (data: Profile[]): SelectOptions<Profile>[] => {
    const options: SelectOptions<Profile>[] = data.map((profile) => ({
      value: profile,
      label: profile.name,
    }));
    return options;
  };

  const formatUsers = (
    data: UserWithRelation[]
  ): ListItem<UserWithRelation>[] => {
    return data.map((user) => {
      const cols: ListColumn<UserWithRelation>[] = [
        {
          value: user.username,
        },
        {
          value: user.registration,
        },
        {
          value: user.email,
        },
        {
          value: user.profile.name,
        },
      ];
      return {
        value: user,
        uniqueIdentifier: user.id,
        cols,
        label: user.username,
      };
    });
  };

  const handleRegister = () => {
    setIsRegistering(!isRegistering);
    formData.username = "";
    formData.email = "";
    formData.registration = "";
    formData.password = "";
    setSelectedOption(null);
  };

  const handleDelete = async (id: number | string) => {
    console.log(id);
    try {
      await axios.delete(`http://localhost:8000/dashboard/user/${id}`);
    } catch (error) {
      console.error("Erro ao deletar o usuário:", error);
    } finally {
      fetchUserList();
    }
  };

  const fetchUserList = async () => {
    try {
      const response = await axios.get<UserWithRelation[]>(
        "http://localhost:8000/dashboard/user"
      );
      const { data } = response;
      console.log(data);
      const formatted = formatUsers(data);
      setUsers(data);
      setUserList(formatted);
    } catch (error) {
      console.error("Erro ao listar os usuários:", error);
    }
  };

  const fetchProfileList = async () => {
    try {
      const response = await axios.get<Profile[]>(
        `http://localhost:8000/dashboard/profile/`
      );
      const { data } = response;
      const formatted = formatProfileOptions(data);
      setProfileOptions(formatted);
    } catch (error) {}
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedOption) return;
    try {
      const form = {
        username: formData.username,
        email: formData.email,
        registration: formData.registration,
        password: formData.password,
        profile_id: selectedOption.value.id,
      };
      const response = await axios.post(
        "http://localhost:8000/dashboard/user",
        form
      );
      notify('sucess', 'Usuário cadastrado com sucesso!')
      formData.username = "";
      formData.email = "";
      formData.registration = "";
      formData.password = "";
      setSelectedOption(null);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      notify('error', message);
    } finally {
      fetchUserList();
    }
  };

  const onFilterChange = (value: string) => {
    const filteredUsers = users.filter(
      (item) =>
        item.username.toLowerCase().includes(value.toLowerCase()) ||
        item.registration.toLowerCase().includes(value.toLowerCase()) ||
        item.profile.name.toLowerCase().includes(value.toLowerCase())
    );
    setUserList(formatUsers(filteredUsers));
  };
  useEffect(() => {
    fetchUserList();
    fetchProfileList();
  }, []);

  const animatedComponents = makeAnimated();
  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <ToastContainer />
      {isRegistering ? (
        <>
          <div className="flex gap-16 items-center justify-between">
            <h1 className="font-bold text-xl">Gerenciamento de usuário</h1>
            <GenericButton
              onClick={handleRegister}
              text="Voltar"
              icon={Icon.return}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <h1></h1>
            <TextInput
              label="Nome do usuário"
              type="text"
              name="username"
              isRequired={true}
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
            <TextInput
              label="E-mail"
              type="email"
              name="email"
              isRequired={true}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <TextInput
              label="Matrícula"
              type="text"
              name="registration"
              isRequired={true}
              value={formData.registration}
              onChange={(e) => handleChange("registration", e.target.value)}
            />
            <TextInput
              label="Senha"
              type="password"
              name="password"
              isRequired={true}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <div className="flex flex-col mt-5">
              <Select
                className="w-80"
                closeMenuOnSelect={true}
                components={animatedComponents}
                defaultValue={[]}
                name="options"
                options={profileOptions}
                onChange={handleSelectChange}
                value={selectedOption}
              />
            </div>
            <ButtonInput label="Enviar" onSubmit={() => handleSubmit} />
          </form>
        </>
      ) : (
        <>
          <div className="flex gap-16 items-center justify-between">
            <h1 className="font-bold text-xl">Gerenciamento de usuário</h1>
            <GenericButton
              onClick={handleRegister}
              text="Cadastrar novo usuário"
              icon={Icon.add}
            />
          </div>
          <List
            data={userList}
            onFilterChange={onFilterChange}
            onSeeMore={() => {}}
            onDelete={(value) => handleDelete(value.id)}
            listEntity="o usuário"
          />
        </>
      )}
    </div>
  );
};

export default UserManagement;
