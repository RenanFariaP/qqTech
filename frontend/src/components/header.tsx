"use client";

import Image from "next/image";
import logoMarca from "../../public/logomarca.png";
import { useAuth } from "@/contexts/AuthContext";
import LogoutSvg from "./svg/logout";
import UserSvg from "./svg/userIcon";

const Header = () => {
  const { user, logout } = useAuth();
  if (user.token === "") {
    return (
      <div className="flex justify-between items-center h-24 w-full bg-[#418713] p-10">
        <Image className="h-16 w-auto" src={logoMarca} alt="VerdeCard" />
      </div>
    );
  }
  return (
    <div className="flex justify-between items-center h-24 w-full bg-[#418713] p-10">
      <Image className="h-16 w-auto" src={logoMarca} alt="VerdeCard" />
      <div className="flex gap-5 p-3 border rounded-md items-center">
        <div className="text-white flex gap-1 items-center">
          <UserSvg />
          Olá {user.username}, seja bem-vindo!
        </div>
        <button onClick={logout}>
          <LogoutSvg />
        </button>
      </div>
    </div>
  );
};

export default Header;
