"use client"

import List, { ListColumn, ListItem } from '@/components/list';
import RegisterButton from '@/components/registerButton';
import { methods as mockMethods } from "../../../mocks/methods";
import { Method } from '@/types/method';
import React, { useEffect, useState } from 'react'

const FunctionManagement = () => {
  const [methods, setMethods] = useState<Method[]>([]);
  const [listMethods, setListMethods] = useState<ListItem<Method>[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const formatMethods = (data: Method[]): ListItem<Method>[] => {
    return data.map((method) => {
      const cols: ListColumn<Method>[] = [
        {
          value: method.name,
        },
        {
          value: method.description,
        },
        {
          value: method.tag,
        },
      ];
      return {
        value: method,
        uniqueIdentifier: method.id,
        cols,
      };
    });
  };

  const handleDelete = (id: number | string) => {
    setListMethods((prev)=>{
      const updatedMethods = prev.filter(method => method.value.id !== id);
      return updatedMethods
    });
  };

  const onFilterChange = (value: string) => {
    const filteredMethods = methods.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setListMethods(formatMethods(filteredMethods));
  };

  useEffect(() => {
    const fetchMethods = () => {
      setMethods(mockMethods);
      const formattedMethods = formatMethods(mockMethods);
      setListMethods(formattedMethods);
    };
    fetchMethods();
  }, []);

  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <div className="flex gap-16 items-center">
        <h1 className="font-bold text-xl">Gerenciamento de função</h1>
        <RegisterButton
          text="função"
          onRegister={() => setIsRegistering(true)}
        />
      </div>
        {isRegistering ? (
          <p>Cadastrando</p>
        ) : (
          <List
            data={listMethods}
            onFilterChange={onFilterChange}
            onDelete={handleDelete}
            onSeeMore={()=>{}}
            searchLabel="Nome do função"
          />
        )}
    </div>
  );
};

export default FunctionManagement