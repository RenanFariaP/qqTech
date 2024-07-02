"use client";

import Image from "next/image";
import logoMarca from "../../public/logomarca.png";
import { useAuth } from "@/contexts/AuthContext";
import LogoutSvg from "./svg/logout";
import UserSvg from "./svg/userIcon";

const Header = () => {
  const { user, logout, menuOpen } = useAuth();
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
      <div className="lg:hidden block" onClick={menuOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </div>
      <div className="hidden gap-5 p-3 border rounded-md items-center lg:flex">
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
