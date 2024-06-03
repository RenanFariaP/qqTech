"use client";

import List, { ListColumn, ListItem } from "@/components/list";
import RegisterButton from "@/components/registerButton";
import { users as mockUsers } from "../../../mocks/users";
import React, { useEffect, useState } from "react";
import { User } from "@/types/user";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [listUsers, setListUsers] = useState<ListItem<User>[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

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
          value: user.profile,
        },
      ];
      return {
        value: user,
        uniqueIdentifier: user.id,
        cols,
      };
    });
  };

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
      <div className="flex gap-16 items-center">
        <h1 className="font-bold text-xl">Gerenciamento de usuário</h1>
        <RegisterButton
          text="usuário"
          onRegister={() => setIsRegistering(true)}
        />
      </div>
        {isRegistering ? (
          <p>Cadastrando</p>
        ) : (
          <List
            data={listUsers}
            onFilterChange={onFilterChange}
            searchLabel="Nome do usuário"
          />
        )}
    </div>
  );
};

export default UserManagement;
