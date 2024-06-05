"use client";

import List, { ListColumn, ListItem } from "@/components/list";
import { profiles as mockProfiles } from "../../../mocks/profile";
import { Profile } from "@/types/profile";
import React, { useEffect, useState } from "react";
import GenericButton, { Icon } from "@/components/genericButton";

const ProfileManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [listProfiles, setListProfiles] = useState<ListItem<Profile>[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const formatProfiles = (data: Profile[]): ListItem<Profile>[] => {
    return data.map((profile) => {
      const cols: ListColumn<Profile>[] = [
        {
          value: profile.label,
        },
        {
          value: profile.description,
        },
      ];
      return {
        value: profile,
        uniqueIdentifier: profile.id,
        cols,
        label: profile.label,
      };
    });
  };

  const handleDelete = (id: number | string) => {
    setListProfiles((prev) => {
      const updatedProfiles = prev.filter((profile) => profile.value.id !== id);
      return updatedProfiles;
    });
  };

  const onFilterChange = (value: string) => {
    const filteredProfiles = profiles.filter(
      (item) =>
        item.label.toLowerCase().includes(value.toLowerCase()) ||
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
      <div className="flex gap-16 items-center justify-between">
        <h1 className="font-bold text-xl">Gerenciamento de perfil</h1>
        {/* <GenericButton text="Voltar" icon={Icon.add} /> */}
      </div>
      {isRegistering ? (
        <p>Cadastrando</p>
      ) : (
        <List
          data={listProfiles}
          onFilterChange={onFilterChange}
          onSeeMore={() => {}}
          onDelete={handleDelete}
          listEntity="o perfil"
        />
      )}
    </div>
  );
};

export default ProfileManagement;


