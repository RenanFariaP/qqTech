"use client";

import GenericButton, { Icon } from "@/components/genericButton";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { MethodInfos } from "@/types/infos/methodInfos";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GetMethod = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [methodId, setMethodId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");

  const handleGetMethod = async (id: number) => {
    try {
      const response = await axios.get<MethodInfos>(
        `http://localhost:8000/dashboard/method/${id}`
      );
      const method = response.data;
      setMethodId(method.id);
      setName(method.name);
      setDescription(method.description);
      setTag(method.TAG);
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
    handleGetMethod(id);
  }, [params.id]);
  return (
    <div className="w-full h-full relative p-5 flex flex-col">
      <div className="text-lg font-bold">Exibição de Função</div>
      <div className="flex items-center justify-center w-full h-full">
        <div className="absolute lg:top-10 lg:right-14 top-4 right-9">
          <GenericButton
            onClick={() => router.push(`/dashboard/method/`)}
            text="Voltar"
            icon={Icon.return}
            width="100px"
          />
        </div>
        <div className="absolute lg:bottom-10 lg:right-14 bottom-6 right-9">
          <GenericButton
            onClick={() => router.push(`/dashboard/method/edit/${methodId}`)}
            text="Editar função"
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

export default GetMethod;
