"use client";

import GenericButton, { Icon } from "@/components/genericButton";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { TransactionInfos } from "@/types/infos/transactionInfos";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GetTransaction = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");

  const handleGetTransaction = async (id: number) => {
    try {
      const response = await axios.get<TransactionInfos>(
        `http://localhost:8000/dashboard/transaction/${id}`
      );
      const transaction = response.data;
      console.log(transaction);
      setTransactionId(transaction.id);
      setName(transaction.name);
      setDescription(transaction.description);
      setTag(transaction.TAG);
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
    handleGetTransaction(id);
  }, [params.id]);
  return (
    <div className="w-full h-full relative p-5 flex flex-col">
      <div className="text-lg font-bold">Exibição de Transação</div>
      <div className="flex items-center justify-center w-full h-full">
        <div className="absolute top-10 right-14">
          <GenericButton
            onClick={() => router.push(`/dashboard/transaction/`)}
            text="Voltar"
            icon={Icon.return}
            width="100px"
          />
        </div>
        <div className="absolute bottom-10 right-14">
          <GenericButton
            onClick={() =>
              router.push(`/dashboard/transaction/edit/${transactionId}`)
            }
            text="Editar transação"
            icon={Icon.edit}
            width="180px"
          />
        </div>
        <div className="flex flex-col items-center justify-center bg-white p-5 rounded-md">
          <div className="w-full flex items-center justify-center [border-bottom:1px_solid_#DDD] pb-2 mb-2 font-bold">
            {name}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center">
              <div className="bg-[#d2d2d2] w-80 h-min-80 rounded-sm p-3 border border-zinc-300">
                {description}
              </div>
            </div>
            <div className="flex gap-2 justify-center [border-top:1px_solid_#DDD] pt-2">
              <div>TAG:</div>
              <div>{tag}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetTransaction;
