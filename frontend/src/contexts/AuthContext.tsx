"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { Error } from "@/types/error";
import { Notify } from "@/components/toast";

interface AuthUser {
  email: string;
  token: string;
  username: string;
  userId: string;
}

interface ResponseData {
  data: {
    access_token: string;
    email: string;
    username: string;
    userId: string;
  };
}

const AuthContext = createContext({
  loading: true,
  login: async (email: string, password: string) => {},
  logout: () => {},
  user: { email: "", token: "", username: "", userId: ""},
  menuOpen : () => {},
  isMenuOpen: false
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser>({
    email: "",
    token: "",
    username: "",
    userId: ""
  });
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsOpenMenu] = useState(false);
  const router = useRouter();

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId")
    if (token && email && username && userId) {
      setUser({ email, token, username, userId });
    }
    setLoading(false);
    setIsOpenMenu(false);
  }, []);

  const login = async (email: string, password: string) => {
    const form = {
      email: email,
      password: password,
    };
    try {
      const response: ResponseData = await axios.post(
        "http://localhost:8000/login",
        form
      );
      if (response.data.access_token) {
        const token = response.data.access_token;
        const email = response.data.email;
        const username = response.data.username;
        const userId = response.data.userId
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data.userId);
        setUser({ email, token, username, userId });
        router.replace("/dashboard");
      }
    } catch (error) {
      const e = error as Error;
      const message = e.response.data.detail;
      Notify('error', message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    setUser({ email: "", token: "", username: "", userId: "" });
    router.replace("/login");
  };

  const menuOpen = () =>{
    setIsOpenMenu(!isMenuOpen);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, menuOpen, isMenuOpen}}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export { AuthProvider, AuthContext, useAuth };
