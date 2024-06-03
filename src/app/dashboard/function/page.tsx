"use client"

import List, { ListColumn, ListItem } from '@/components/list';
import RegisterButton from '@/components/registerButton';
import { methods as mockMethods } from "../../../mocks/methods";
import { Method } from '@/types/method';
import React, { useEffect, useState } from 'react'

const FunctionManagement = () => {
  const [methods, setMethods] = useState<Method[]>([]);
  const [listMethods, setListMethods] = useState<ListItem<Method>[]>([]);

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
    <div className="flex flex-col p-10 gap-5 ">
      <div className="flex gap-16 items-center">
        <h1 className="font-bold text-xl">Gerenciamento de função</h1>
        <RegisterButton text="função" />
      </div>
      <div className="w-full">
        <List
          data={listMethods}
          onFilterChange={onFilterChange}
          searchLabel="Nome do função"
        />
      </div>
    </div>
  );
};

export default FunctionManagement