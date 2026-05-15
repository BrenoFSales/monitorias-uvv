import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { MonitoriaCard } from "@/components/MonitoriaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertCircle, GraduationCap, Search } from "lucide-react";

export default function AlunoBuscar() {
  const { user } = useAuth();
  const [monitorias, setMonitorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [semPerfil, setSemPerfil] = useState(false);
  const [search, setSearch] = useState("");
  const [inscrevendo, setInscrevendo] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchTudo();
  }, [user]);

  async function fetchTudo() {
    setLoading(true);
    const { data: perfil } = await supabase
      .from("alunos")
      .select("user_id")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (!perfil) {
      setSemPerfil(true);
      setLoading(false);
      return;
    }

    await fetchMonitorias();
    setLoading(false);
  }

  async function fetchMonitorias() {
    const { data } = await supabase
      .from("monitorias")
      .select(`*, disciplinas(nome), monitores!monitor_id(usuarios(nome))`)
      .eq("status", "agendada")
      .order("data_hora_inicio", { ascending: true });
    setMonitorias(data ?? []);
  }

  const filtradas = monitorias.filter((m) => {
    const nome = (m.disciplinas?.nome ?? "").toLowerCase();
    const local = (m.local ?? "").toLowerCase();
    const q = search.toLowerCase();
    return nome.includes(q) || local.includes(q);
  });

  const handleInscrever = async (monitoriaId: string) => {
    if (!user) return;
    setInscrevendo(monitoriaId);
    const { error } = await supabase
      .from("inscricoes")
      .insert({ aluno_id: user.id, monitoria_id: monitoriaId, status: "confirmada", presente: false });
    if (error) {
      if (error.code === "23503") {
        toast.error("Perfil de aluno incompleto.", {
          description: "Seu cadastro está incompleto. Fale com o coordenador.",
        });
      } else {
        toast.error("Erro ao realizar inscrição. Tente novamente.");
      }
    } else {
      toast.success("Inscrição realizada com sucesso!", {
        description: "Você receberá uma confirmação por e-mail.",
      });
      fetchMonitorias();
    }
    setInscrevendo(null);
  };

  if (semPerfil) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-secondary" />
            Buscar Monitorias
          </h2>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold">Perfil de aluno incompleto</p>
            <p className="text-muted-foreground">
              Seu usuário não possui registro na tabela <code>alunos</code>. O cadastro não foi concluído corretamente.
            </p>
            <p className="text-muted-foreground">
              Delete este usuário no painel do Supabase e rode o seed novamente, ou solicite ao coordenador.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-secondary" />
          Buscar Monitorias
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Encontre monitorias disponíveis e inscreva-se
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar disciplina ou local..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((m) => (
            <MonitoriaCard
              key={m.id}
              monitoria={m}
              actions={
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleInscrever(m.id)}
                  disabled={inscrevendo === m.id}
                >
                  {inscrevendo === m.id ? "Inscrevendo..." : "Inscrever-se"}
                </Button>
              }
            />
          ))}
          {filtradas.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-8">
              Nenhuma monitoria disponível.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
