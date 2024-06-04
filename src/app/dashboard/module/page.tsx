"use client"

import List, { ListColumn, ListItem } from '@/components/list';
import RegisterButton from '@/components/registerButton';
import { modules as mockModules } from "../../../mocks/modules";
import { Module } from '@/types/module';
import React, { useEffect, useState } from 'react'

const ModuleManagement = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [listModules, setListModules] = useState<ListItem<Module>[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const formatModules = (data: Module[]): ListItem<Module>[] => {
    return data.map((module) => {
      const cols: ListColumn<Module>[] = [
        {
          value: module.name,
        },
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
      };
    });
  };

  const handleDelete = (id: number | string) => {
    setListModules((prev)=>{
      const updatedModules = prev.filter(module => module.value.id !== id);
      return updatedModules
    });
  };

  const onFilterChange = (value: string) => {
    const filteredModules = modules.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setListModules(formatModules(filteredModules));
  };

  useEffect(() => {
    const fetchModules = () => {
      setModules(mockModules);
      const formattedModules = formatModules(mockModules);
      setListModules(formattedModules);
    };
    fetchModules();
  }, []);

  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <div className="flex gap-16 items-center">
        <h1 className="font-bold text-xl">Gerenciamento de módulo</h1>
        <RegisterButton
          text="módulo"
          onRegister={() => setIsRegistering(true)}
        />
      </div>
        {isRegistering ? (
          <p>Cadastrando</p>
        ) : (
          <List
            data={listModules}
            onFilterChange={onFilterChange}
            onDelete={handleDelete}
            onSeeMore={()=>{}}
            searchLabel="Nome do módulo"
          />
        )}
    </div>
  );
};

export default ModuleManagement