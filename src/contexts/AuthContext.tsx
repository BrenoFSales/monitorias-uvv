import { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "@/types/models";

interface AuthUser {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: (AuthUser & { password: string })[] = [
  { id: "a1", nome: "João Aluno", email: "aluno@uvv.br", matricula: "2024001", role: "aluno", password: "123456" },
  { id: "m1", nome: "Carlos Silva", email: "monitor@uvv.br", matricula: "2023010", role: "monitor", password: "123456" },
  { id: "c1", nome: "Prof. Mariana", email: "coord@uvv.br", matricula: "2020001", role: "coordenador", password: "123456" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, _password: string) => {
    const found = MOCK_USERS.find((u) => u.email === email);
    if (!found) throw new Error("Usuário não encontrado");
    const { password: _, ...userData } = found;
    setUser(userData);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
