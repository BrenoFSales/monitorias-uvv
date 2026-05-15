import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
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
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUsuario(authId: string): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nome, email, matricula, role")
    .eq("id", authId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    nome: data.nome,
    email: data.email,
    matricula: data.matricula,
    role: data.role as UserRole,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          setUser(null);
          // Só encerra o loading no evento inicial — para os outros já está false
          if (event === "INITIAL_SESSION") setLoading(false);
          return;
        }

        const userId = session.user.id;

        // setTimeout(0) é essencial: tira o fetchUsuario do contexto de lock
        // interno do Supabase auth, evitando deadlock com o próprio onAuthStateChange
        setTimeout(async () => {
          const u = await fetchUsuario(userId);
          setUser(u);
          if (event === "INITIAL_SESSION") setLoading(false);
        }, 0);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const u = await fetchUsuario(data.user.id);
    if (!u) throw new Error("Usuário não encontrado na base de dados");
    setUser(u);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
