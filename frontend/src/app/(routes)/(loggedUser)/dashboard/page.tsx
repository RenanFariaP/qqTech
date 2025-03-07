"use client";

import Charts, { Icon } from "@/components/charts";
import { Notify } from "@/components/toast";
import { Error } from "@/types/error";
import { Method } from "@/types/method";
import { Module } from "@/types/module";
import { Profile } from "@/types/profile";
import { Transaction } from "@/types/transaction";
import { UserWithRelation } from "@/types/user";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function page() {
  const [users, setUsers] = useState<number | null>(0);
  const [profiles, setProfiles] = useState<number| null>(0);
  const [modules, setModules] = useState<number| null>(0);
  const [methods, setMethods] = useState<number| null>(0);
  const [transactions, setTransactions] = useState<number| null>(0);

  const registerUser = async () => {
    try {
      const response = await axios.get<UserWithRelation[]>(
        "http://localhost:8000/dashboard/user"
      );
      const {data} = response;
      setUsers(data.length)
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };
  const registerProfile = async () => {
    try {
      const response = await axios.get<Profile[]>(
        "http://localhost:8000/dashboard/profile"
      );
      const {data} = response;
      setProfiles(data.length)
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };
  const registerModule = async () => {
    try {
      const response = await axios.get<Module[]>(
        "http://localhost:8000/dashboard/module"
      );
      const {data} = response;
      setModules(data.length)
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };
  const registerTransaction = async () => {
    try {
      const response = await axios.get<Transaction[]>(
        "http://localhost:8000/dashboard/transaction"
      );
      const {data} = response;
      setTransactions(data.length)
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };
  const registerMethod = async () => {
    try {
      const response = await axios.get<Method[]>(
        "http://localhost:8000/dashboard/method"
      );
      const {data} = response;
      setMethods(data.length)
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };
  
  useEffect(() => {
    registerUser();
    registerProfile();
    registerModule();
    registerTransaction();
    registerMethod();
  }, []);
  return (
    <div className="p-10 flex flex-wrap gap-5">
      <Charts title="Usuários cadastrados" value={users} path="user" icon={Icon.user}/>
      <Charts title="Perfis cadastrados" value={profiles} path="profile" icon={Icon.profile}/>
      <Charts title="Módulos cadastrados" value={modules} path="module" icon={Icon.module}/>
      <Charts title="Transações cadastradas" value={transactions} path="transaction" icon={Icon.transaction}/>
      <Charts title="Funções cadastradas" value={methods} path="method" icon={Icon.method}/>
    </div>
  );
}
