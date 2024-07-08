"use client";

import ButtonInput from "@/components/buttonInput";
import { ListColumn, ListItem } from "@/components/list";
import UserSvg from "@/components/svg/userIcon";
import TableList from "@/components/tableList";
import TextInput from "@/components/textInput";
import { Notify } from "@/components/toast";
import { useAuth } from "@/contexts/AuthContext";
import { Error } from "@/types/error";
import { MethodInfos } from "@/types/infos/methodInfos";
import { ModuleInfos } from "@/types/infos/moduleInfos";
import { ProfileInfos } from "@/types/infos/profileInfos";
import { TransactionInfos } from "@/types/infos/transactionInfos";
import { UserWithRelation } from "@/types/user";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

const MyAccount = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [registration, setRegistration] = useState("");
  const [profile, setProfile] = useState<ProfileInfos>();
  const [modulesFormatted, setModulesFormatted] = useState<
    ListItem<ModuleInfos>[]
  >([]);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [passwordChange, setPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

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

  const handleGetUser = async () => {
    try {
      const response = await axios.get<UserWithRelation>(
        `http://localhost:8000/dashboard/user/${user.userId}`
      );
      const responseUser = response.data;
      setUserId(responseUser.id);
      setUsername(responseUser.username);
      setEmail(responseUser.email);
      setRegistration(responseUser.registration);
      setProfileId(responseUser.profile_id);
      if (!responseUser.profile) {
        return;
      }
      setProfile(responseUser.profile);
      if (!responseUser.profile.modules) {
        return;
      }
      const formatted = formatModules(responseUser.profile.modules);
      setModulesFormatted(formatted);
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify("error", message);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (newPassword != newPasswordConfirmation) {
      Notify("error", "As senhas não estão iguais!");
      return;
    }
    try {
      const form = {
        username: username,
        email: email,
        registration: registration,
        password: newPassword,
        profile_id: profileId,
      };
      const response = await axios.put(
        `http://localhost:8000/dashboard/user/${userId}`,
        form
      );
      setPasswordChange(false);
      Notify("success", "Senha atualizada!");
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify("error", message);
    }
  };

  useEffect(() => {
    if (!user) {
      logout();
    }
    handleGetUser();
  }, [user]);

  return (
    <div className="w-full flex justify-center p-10">
      <div className="bg-white p-7 h-auto rounded-md">
        <div className="flex justify-center">
          <UserSvg height={48} width={48} />
        </div>
        <div className="flex justify-center font-bold my-3
        ">Olá, {username}</div>
        <div className="flex gap-3">
          <p className="font-bold">E-mail:</p>
          <p>{email}</p>
        </div>
        <div className="flex gap-3">
          <p className="font-bold">Matrícula:</p>
          <p>{registration}</p>
        </div>
        <div
          className="gap-2 flex"
          onClick={() =>
            profile ? router.push(`/dashboard/profile/get/${profile.id}`) : {}
          }
        >
          <p className="font-bold">Perfil:</p>
          <p className="cursor-pointer hover:text-zinc-500">
            {profile ? profile.name : "Usuário sem perfil associado"}
          </p>
        </div>
        <div className="flex flex-col w-full mt-3">
          <TableList title="Módulos" data={modulesFormatted} route="/module/" />
        </div>
        {passwordChange ? (
          <div className="bg-[#d2d2d2] p-5 flex flex-col rounded-md mt-5">
            <h1 className="font-bold">Escolha uma nova senha</h1>
            <form onSubmit={handleSubmit}>
              <TextInput
                label="Nova senha"
                type="password"
                name="password"
                isRequired={true}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextInput
                label="Confirmação de senha"
                type="password"
                name="password"
                isRequired={true}
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              />
              <div className="flex justify-between gap-5">
                <button className="flex justify-center items-center bg-red-700 py-2 px-7 rounded-md text-white my-5 shadow-sm" onClick={()=>setPasswordChange(false)}>Cancelar</button>
                <ButtonInput label="Enviar" onSubmit={() => {}} />
              </div>
            </form>
          </div>
        ) : (
          <div className="flex justify-center mt-5">
            <button
              className="flex justify-center items-center bg-[#418713] py-2 px-7 rounded-md text-white my-5 shadow-sm"
              onClick={() => {
                setPasswordChange(true);
              }}
            >
              Alterar sua senha
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
