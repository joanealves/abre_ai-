import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, "id" | "createdAt"> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AUTH_STORAGE_KEY = "abreai_user";
const USERS_STORAGE_KEY = "abreai_users";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const register = async (userData: Omit<User, "id" | "createdAt"> & { password: string }): Promise<boolean> => {
    try {
      // Obter usuários existentes
      const usersData = localStorage.getItem(USERS_STORAGE_KEY);
      const users = usersData ? JSON.parse(usersData) : [];

      // Verificar se email já existe
      if (users.some((u: any) => u.email === userData.email)) {
        toast.error("Este email já está cadastrado!");
        return false;
      }

      // Criar novo usuário
      const newUser: User = {
        id: `USER-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        createdAt: new Date(),
      };

      // Salvar usuário com senha (em produção, use hash!)
      const userWithPassword = {
        ...newUser,
        password: userData.password, // EM PRODUÇÃO, USE BCRYPT OU SIMILAR!
      };

      users.push(userWithPassword);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Fazer login automático
      setUser(newUser);
      toast.success("Cadastro realizado com sucesso! 🎉");
      return true;
    } catch (error) {
      toast.error("Erro ao realizar cadastro");
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const usersData = localStorage.getItem(USERS_STORAGE_KEY);
      const users = usersData ? JSON.parse(usersData) : [];

      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) {
        toast.error("Email ou senha incorretos!");
        return false;
      }

      // Remover senha antes de salvar no estado
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      toast.success(`Bem-vindo(a), ${foundUser.name}! 👋`);
      return true;
    } catch (error) {
      toast.error("Erro ao fazer login");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast.info("Você saiu da sua conta");
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);

    // Atualizar também no storage de usuários
    const usersData = localStorage.getItem(USERS_STORAGE_KEY);
    const users = usersData ? JSON.parse(usersData) : [];
    const updatedUsers = users.map((u: any) =>
      u.id === user.id ? { ...u, ...userData } : u
    );
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    toast.success("Perfil atualizado com sucesso!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};