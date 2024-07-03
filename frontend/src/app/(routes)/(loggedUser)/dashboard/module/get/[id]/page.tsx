"use client";

import GenericButton, { Icon } from "@/components/genericButton";
import { ListColumn, ListItem } from "@/components/list";
import TableList from "@/components/tableList";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { MethodInfos } from "@/types/infos/methodInfos";
import { ModuleInfos } from "@/types/infos/moduleInfos";
import { TransactionInfos } from "@/types/infos/transactionInfos";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GetModule = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [moduleId, setModuleId] = useState<number | null>(null);
  const [name, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [transactionsFormatted, setTransactionsFormatted] = useState<
    ListItem<TransactionInfos>[]
  >([]);
  const [methodsFormatted, setMethodsFormatted] = useState<
    ListItem<MethodInfos>[]
  >([]);

  const formatTransactions = (
    data: TransactionInfos[]
  ): ListItem<TransactionInfos>[] => {
    return data.map((transaction) => {
      const cols: ListColumn<string>[] = [
        { value: transaction.name },
        { value: transaction.TAG },
      ];
      return {
        value: transaction,
        uniqueIdentifier: transaction.id,
        cols,
        label: transaction.name,
      };
    });
  };

  const formatMethods = (data: MethodInfos[]): ListItem<MethodInfos>[] => {
    return data.map((method) => {
      const cols: ListColumn<string>[] = [
        { value: method.name },
        { value: method.TAG },
      ];
      return {
        value: method,
        uniqueIdentifier: method.id,
        cols,
        label: method.name,
      };
    });
  };

  const handleGetModule = async (id: number) => {
    try {
      const response = await axios.get<ModuleInfos>(
        `http://localhost:8000/dashboard/module/${id}`
      );
      const module = response.data;
      setModuleId(module.id);
      setModuleName(module.name);
      setDescription(module.description);
      setTag(module.TAG);
      if (!module.methods) {
        return;
      }
      const formattedMethods = formatMethods(module.methods);
      setMethodsFormatted(formattedMethods);
      if (!module.transactions) {
        return;
      }
      const formatted = formatTransactions(module.transactions);
      setTransactionsFormatted(formatted);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify("error", message);
    }
  };

  useEffect(() => {
    if (!params.id) {
      return;
    }
    const id = parseInt(params.id);
    handleGetModule(id);
  }, [params.id]);
  return (
    <div className="w-full h-full relative p-5 flex flex-col">
      <div className="text-lg font-bold">Exibição de Módulo</div>
      <div className="flex items-center justify-center w-full h-full">
        <div className="absolute lg:top-10 lg:right-14 top-4 right-9">
          <GenericButton
            onClick={() => router.push(`/dashboard/module/`)}
            text="Voltar"
            icon={Icon.return}
            width="100px"
          />
        </div>
        <div className="absolute lg:bottom-10 lg:right-14 bottom-6 right-9">
          <GenericButton
            onClick={() => router.push(`/dashboard/module/edit/${moduleId}`)}
            text="Editar módulo"
            icon={Icon.edit}
            width="160px"
          />
        </div>
        <div className="flex flex-col items-center justify-center bg-white p-5 rounded-md">
          <div className="w-full flex items-center justify-center [border-bottom:1px_solid_#DDD] pb-2 mb-2 font-bold">
            {name}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-center">
              <div className="bg-[#d2d2d2] w-80 h-32 rounded-sm p-3 border border-zinc-300">
                {description}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full mt-2 gap-3">
            <TableList
              title="Transações"
              data={transactionsFormatted}
              route="/transaction/"
            />
            <TableList
              title="Funções"
              data={methodsFormatted}
              route="/method/"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetModule;
