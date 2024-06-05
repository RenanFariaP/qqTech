"use client";

import List, { ListColumn, ListItem } from "@/components/list";
import { transactions as mockTransactions } from "../../../mocks/transactions";
import React, { useEffect, useState } from "react";
import { Transaction } from "@/types/transaction";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import GenericButton, { Icon } from "@/components/genericButton";

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [listTransactions, setListTransactions] = useState<
    ListItem<Transaction>[]
  >([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const formatTransactions = (data: Transaction[]): ListItem<Transaction>[] => {
    return data.map((transaction) => {
      const cols: ListColumn<Transaction>[] = [
        {
          value: transaction.name,
        },
        {
          value: transaction.description,
        },
        {
          value: transaction.tag,
        },
      ];
      return {
        value: transaction,
        uniqueIdentifier: transaction.id,
        cols,
        label: transaction.name,
      };
    });
  };

  const handleRegister = () => {
    setIsRegistering(!isRegistering);
  };

  const handleDelete = (id: number | string) => {
    setListTransactions((prev) => {
      const updatedTransactions = prev.filter(
        (transaction) => transaction.value.id !== id
      );
      return updatedTransactions;
    });
  };

  const onFilterChange = (value: string) => {
    const filteredTransactions = transactions.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setListTransactions(formatTransactions(filteredTransactions));
  };

  useEffect(() => {
    const fetchTransactions = () => {
      setTransactions(mockTransactions);
      const formattedTransactions = formatTransactions(mockTransactions);
      setListTransactions(formattedTransactions);
    };
    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col p-10 gap-5 w-full h-full">
      <div className="flex gap-16 items-center justify-between">
        <h1 className="font-bold text-xl">Gerenciamento de transação</h1>
        <GenericButton
          onClick={handleRegister}
          text="Voltar"
          icon={Icon.return}
        />
      </div>
      {isRegistering ? (
        <p>Cadastrando</p>
      ) : (
        <List
          data={listTransactions}
          onFilterChange={onFilterChange}
          onSeeMore={() => {}}
          onDelete={handleDelete}
          listEntity="a transação"
        />
      )}
    </div>
  );
};

export default TransactionManagement;
