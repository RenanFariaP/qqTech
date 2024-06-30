"use client";

import Charts from "@/components/charts";
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
      console.log(data.length);
      setUsers(data.length)
    } catch (error) {}
  };
  const registerProfile = async () => {
    try {
      const response = await axios.get<Profile[]>(
        "http://localhost:8000/dashboard/profile"
      );
      const {data} = response;
      console.log(data.length);
      setProfiles(data.length)
    } catch (error) {}
  };
  const registerModule = async () => {
    try {
      const response = await axios.get<Module[]>(
        "http://localhost:8000/dashboard/module"
      );
      const {data} = response;
      console.log(data.length);
      setModules(data.length)
    } catch (error) {}
  };
  const registerTransaction = async () => {
    try {
      const response = await axios.get<Transaction[]>(
        "http://localhost:8000/dashboard/transaction"
      );
      const {data} = response;
      console.log(data.length);
      setTransactions(data.length)
    } catch (error) {}
  };
  const registerMethod = async () => {
    try {
      const response = await axios.get<Method[]>(
        "http://localhost:8000/dashboard/method"
      );
      const {data} = response;
      console.log(data.length);
      setMethods(data.length)
    } catch (error) {}
  };
  
  console.log(users)
  useEffect(() => {
    registerUser();
    registerProfile();
    registerModule();
    registerTransaction();
    registerMethod();
  }, []);
  return (
    <div className="p-10 flex flex-wrap gap-5">
      <Charts title="Usuários cadastrados" value={users} path="user"/>
      <Charts title="Perfis cadastrados" value={profiles} path="profile"/>
      <Charts title="Módulos cadastrados" value={modules} path="module"/>
      <Charts title="Transações cadastradas" value={transactions} path="transaction"/>
      <Charts title="Funções cadastradas" value={methods} path="method"/>
    </div>
  );
}
