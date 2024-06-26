"use client"

import { useRouter } from 'next/navigation';
import React from 'react'

export default async function page() {
  const router = useRouter();
  return <div>Bem-vindo, Esta é a página do dashboard, acessível apenas para usuários autenticados</div>;
}

