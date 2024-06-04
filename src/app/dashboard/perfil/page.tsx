"use client";

import List, { ListColumn, ListItem } from "@/components/list";
import RegisterButton from "@/components/registerButton";
import { profiles as mockProfiles } from "../../../mocks/profile";
import { Profile } from "@/types/profile";
import React, { useEffect, useState } from "react";

const ProfileManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [listProfiles, setListProfiles] = useState<ListItem<Profile>[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

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
      };
    });
  };

  const handleDelete = (id: number | string) => {
    setListProfiles((prev)=>{
      const updatedProfiles = prev.filter(profile => profile.value.id !== id);
      return updatedProfiles
    });
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
    const fetchProfiles = () => {
      setProfiles(mockProfiles);
      const formattedProfiles = formatProfiles(mockProfiles);
      setListProfiles(formattedProfiles);
    };
    fetchProfiles();
  }, []);

  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <div className="flex gap-16 items-center">
        <h1 className="font-bold text-xl">Gerenciamento de perfil</h1>
        <RegisterButton
          text="perfil"
          onRegister={() => setIsRegistering(true)}
        />
      </div>
        {isRegistering ? (
          <p>Cadastrando</p>
        ) : (
          <List
            data={listProfiles}
            onFilterChange={onFilterChange}
            onDelete={handleDelete}
            onSeeMore={()=>{}}
            searchLabel="Nome do perfil"
          />
        )}
    </div>
  );
};

export default ProfileManagement;
