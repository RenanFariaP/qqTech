"use client";

import GenericButton, { Icon } from "@/components/genericButton";
import { ListColumn, ListItem } from "@/components/list";
import TableList from "@/components/tableList";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { ModuleInfos } from "@/types/infos/moduleInfos";
import { ProfileInfos } from "@/types/infos/profileInfos";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GetProfile = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [profileId, setProfileId] = useState<number | null>(null);
  const [name, setProfileName] = useState("");
  const [description, setDescription] = useState("");
  const [modulesFormatted, setModulesFormatted] = useState<
    ListItem<ModuleInfos>[]
  >([]);

  const formatModules = (data: ModuleInfos[]): ListItem<ModuleInfos>[] => {
    return data.map((module) => {
      const cols: ListColumn<ProfileInfos>[] = [
        {
          value: module.name,
        },
        {
          value: module.TAG,
        },
      ];
      return {
        value: module,
        uniqueIdentifier: module.id,
        cols,
        label: module.name,
      };
    });
  };

  const handleGetProfile = async (id: number) => {
    try {
      const response = await axios.get<ProfileInfos>(
        `http://localhost:8000/dashboard/profile/${id}`
      );
      const profile = response.data;
      setProfileId(profile.id);
      setProfileName(profile.name);
      setDescription(profile.description);
      console.log(profile.description.length);
      if (!profile.modules) {
        return;
      }
      const formatted = formatModules(profile.modules);
      setModulesFormatted(formatted);
      console.log(formatted);
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
    handleGetProfile(id);
  }, [params.id]);
  return (
    <div className="w-full h-full relative p-5 flex flex-col">
      <div className="text-lg font-bold">Exibição de Perfil</div>
      <div className="flex items-center justify-center w-full h-full relative">
        <div className="absolute top-10 right-14">
          <GenericButton
            onClick={() => router.push(`/dashboard/profile/`)}
            text="Voltar"
            icon={Icon.return}
            width="100px"
          />
        </div>
        <div className="absolute bottom-10 right-14">
          <GenericButton
            onClick={() => router.push(`/dashboard/profile/edit/${profileId}`)}
            text="Editar usuário"
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
          <div className="flex flex-col w-full mt-2">
            <TableList
              title="Módulos"
              data={modulesFormatted}
              route="/module/"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetProfile;
