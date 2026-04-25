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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // começa true para hidratar sessão

  // Busca dados do usuário na tabela `usuarios` pelo id do Auth
  const fetchUsuario = async (authId: string): Promise<AuthUser | null> => {
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
  };

  // Hidrata sessão ao montar (recarregar página)
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = await fetchUsuario(session.user.id);
        setUser(u);
      }
      setLoading(false);
    });

    // Ouve mudanças de sessão (login/logout em outras abas, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const u = await fetchUsuario(session.user.id);
          setUser(u);
        } else {
          setUser(null);
        }
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