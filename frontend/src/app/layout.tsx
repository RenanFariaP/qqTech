'use client'

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/header";
import { usePathname, useRouter } from "next/navigation";
import { checkIstPublicRoute } from "@/functions/check-is-public-route";
import PrivateRoute from "@/components/privateRoute";
import PublicRoute from "@/components/publicRoute";
import { useEffect } from "react";
import { checkUserAuthenticated } from "@/functions/check-user-authenticated";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();

  const isPublicPage = checkIstPublicRoute(pathName);

  return (
    <html lang="pt-br">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <title>Beaba</title>
      </head>
      <body className="h-screen w-screen">
        <AuthProvider>
          <Header />
          <main className="flex justify-center items-center h-[calc(100vh-96px)] bg-[#d2d2d2]">
            {isPublicPage ? <PublicRoute>{children}</PublicRoute> : <PrivateRoute>{children}</PrivateRoute>}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
