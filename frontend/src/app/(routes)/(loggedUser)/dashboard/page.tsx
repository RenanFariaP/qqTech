"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
    return (
      <div>
        Esta é a página do dashboard, acessível apenas para usuários
        autenticados
      </div>
    );
}
