"use client";

import List, { ListColumn, ListItem } from "@/components/list";
import RegisterButton, { Icon } from "@/components/genericButton";
import { users as mockUsers } from "../../../mocks/users";
import { profiles as mockProfiles } from "../../../mocks/profile";
import React, { FormEvent, useEffect, useState } from "react";
import { User } from "@/types/user";
import TextInput from "@/components/textInput";
import SelectComponent from "@/components/select";
import { Profile } from "@/types/profile";
import ButtonInput from "@/components/buttonInput";
import GenericButton from "@/components/genericButton";
import { MultiValue } from "react-select";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [listUsers, setListUsers] = useState<ListItem<User>[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [registration, setRegistration] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOption, setSelectedOption] = useState<MultiValue<Profile>>([]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegistration(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLinkedProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      //setSelectedOption(e.);
    };

  const formatUsers = (data: User[]): ListItem<User>[] => {
    return data.map((user) => {
      const cols: ListColumn<User>[] = [
        {
          value: user.name,
        },
        {
          value: user.matricula,
        },
        {
          value: user.email,
        },
        {
          value: user.profile,
        },
      ];
      return {
        value: user,
        uniqueIdentifier: user.id,
        cols,
        label: user.name,
      };
    });
  };

  const handleRegister = () => {
    setIsRegistering(!isRegistering);
  };

  const handleDelete = (id: number | string) => {
    console.log(id);
    setListUsers((prev) => {
      const updatedUsers = prev.filter((user) => user.value.id !== id);
      return updatedUsers;
    });
  };

  const handleSubmit = async (event: FormEvent) =>{
    
    console.log()
  }

  const onFilterChange = (value: string) => {
    const filteredUsers = users.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.matricula.toLowerCase().includes(value.toLowerCase()) ||
        item.profile.toLowerCase().includes(value.toLowerCase())
    );
    setListUsers(formatUsers(filteredUsers));
  };

  useEffect(() => {
    const fetchUsers = () => {
      setUsers(mockUsers);
      const formattedUsers = formatUsers(mockUsers);
      setListUsers(formattedUsers);
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
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
              name="user"
              isRequired={true}
              value={user}
              onChange={handleUserChange}
            />
            <TextInput
              label="E-mail"
              type="email"
              name="email"
              isRequired={true}
              value={email}
              onChange={handleEmailChange}
            />
            <TextInput
              label="Matrícula"
              type="text"
              name="registration"
              isRequired={true}
              value={registration}
              onChange={handleRegistrationChange}
            />
            <TextInput
              label="Senha"
              type="password"
              name="password"
              isRequired={true}
              value={password}
              onChange={handlePasswordChange}
            />
            <SelectComponent options={mockProfiles} onChange={()=>handleLinkedProfileChange}/>
            <ButtonInput label="Enviar" />
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
            data={listUsers}
            onFilterChange={onFilterChange}
            onSeeMore={() => {}}
            onDelete={handleDelete}
            listEntity="usuário"
          />
        </>
      )}
    </div>
  );
};

export default UserManagement;
