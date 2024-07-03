"use client";

import GenericButton, { Icon } from "@/components/genericButton";
import { ListColumn, ListItem } from "@/components/list";
import TableList from "@/components/tableList";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { MethodInfos } from "@/types/infos/methodInfos";
import { ModuleInfos } from "@/types/infos/moduleInfos";
import { ProfileInfos } from "@/types/infos/profileInfos";
import { TransactionInfos } from "@/types/infos/transactionInfos";
import { UserWithRelation } from "@/types/user";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GetUser = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [registration, setRegistration] = useState("");
  const [profile, setProfile] = useState<ProfileInfos>();
  const [modules, setModules] = useState<ModuleInfos[]>([]);
  const [modulesFormatted, setModulesFormatted] = useState<
    ListItem<ModuleInfos>[]
  >([]);
  const [transactions, setTransactions] = useState<
    ListItem<TransactionInfos>[]
  >([]);
  const [methods, setMethods] = useState<ListItem<MethodInfos>[]>([]);

  const formatModules = (data: ModuleInfos[]): ListItem<ModuleInfos>[] => {
    return data.map((module) => {
      const cols: ListColumn<UserWithRelation>[] = [
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
        { value: method.description },
      ];
      return {
        value: method,
        uniqueIdentifier: method.id,
        cols,
        label: method.name,
      };
    });
  };

  const handleGetUser = async (id: number) => {
    try {
      const response = await axios.get<UserWithRelation>(
        `http://localhost:8000/dashboard/user/${id}`
      );
      const user = response.data;
      setUserId(user.id);
      setUsername(user.username);
      setEmail(user.email);
      setRegistration(user.registration);
      if (!user.profile) {
        return;
      }
      setProfile(user.profile);
      if (!user.profile.modules) {
        return;
      }
      const formatted = formatModules(user.profile.modules);
      setModulesFormatted(formatted);

      const allTransactions: TransactionInfos[] = [];
      const allMethods: MethodInfos[] = [];
      user.profile.modules.forEach((module) => {
        allTransactions.push(...module.transactions);
        allMethods.push(...module.methods);
      });

      const formattedTransactions = formatTransactions(allTransactions);
      setTransactions(formattedTransactions);

      const formattedMethods = formatMethods(allMethods);
      setMethods(formattedMethods);
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
    handleGetUser(id);
  }, [params.id]);
  return (
    <div className="flex items-center justify-center w-full h-full relative">
      <div className="absolute top-10 right-14">
        <GenericButton
          onClick={() => router.push(`/dashboard/user/`)}
          text="Voltar"
          icon={Icon.return}
          width="100px"
        />
      </div>
      <div className="absolute bottom-10 right-14">
        <GenericButton
          onClick={() => router.push(`/dashboard/user/edit/${userId}`)}
          text="Editar usuário"
          icon={Icon.edit}
          width="160px"
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-white p-5 rounded-md">
        <div className="w-full flex items-center justify-center [border-bottom:1px_solid_#DDD] pb-2 mb-2 font-bold">
          {username}
        </div>
        <div>
          <div className="m-2">Email: {email}</div>
          <div className="flex w-full justify-between">
            <div className="m-2">Matricula: {registration}</div>
            <div
              className="m-2 gap-2 flex"
              onClick={() =>
                profile
                  ? router.push(`/dashboard/profile/get/${profile.id}`)
                  : {}
              }
            >
              <p>Perfil:</p>
              <p className="cursor-pointer hover:text-zinc-500">
                {profile ? profile.name : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <TableList title="Módulos" data={modulesFormatted} route="/module/" />
        </div>
      </div>
    </div>
  );
};

export default GetUser;
