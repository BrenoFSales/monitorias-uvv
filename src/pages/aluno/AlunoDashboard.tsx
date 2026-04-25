import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface Monitoria {
  id: string;
  data_hora_inicio: string;
  local: string;
  disciplinas: { nome: string };
}

export default function AlunoDashboard() {
  const { user } = useAuth();

  const [totalDisponíveis, setTotalDisponiveis] = useState<number | null>(null);
  const [totalAgendamentos, setTotalAgendamentos] = useState<number | null>(null);
  const [totalAvaliacoes, setTotalAvaliacoes] = useState<number | null>(null);
  const [proximas, setProximas] = useState<Monitoria[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProximas, setLoadingProximas] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      setLoadingStats(true);

      const [{ count: disponiveis }, { count: agendamentos }, { count: avaliacoes }] =
        await Promise.all([
          supabase
            .from("monitorias")
            .select("*", { count: "exact", head: true })
            .eq("status", "agendada"),

          supabase
            .from("inscricoes")
            .select("*", { count: "exact", head: true })
            .eq("aluno_id", user.id),

          supabase
            .from("avaliacoes")
            .select("*", { count: "exact", head: true })
            .eq("aluno_id", user.id),
        ]);

      setTotalDisponiveis(disponiveis ?? 0);
      setTotalAgendamentos(agendamentos ?? 0);
      setTotalAvaliacoes(avaliacoes ?? 0);
      setLoadingStats(false);
    }

    async function fetchProximas() {
      setLoadingProximas(true);

      const now = new Date().toISOString();
      const { data } = await supabase
        .from("monitorias")
        .select("id, data_hora_inicio, local, disciplinas(nome)")
        .eq("status", "agendada")
        .gte("data_hora_inicio", now)
        .order("data_hora_inicio", { ascending: true })
        .limit(3);

      setProximas((data as unknown as Monitoria[]) ?? []);
      setLoadingProximas(false);
    }

    fetchStats();
    fetchProximas();
  }, [user]);

  const primeiroNome = user?.nome?.split(" ")[0] ?? "Aluno";

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold">Olá, {primeiroNome}! 👋</h2>
        <p className="text-muted-foreground text-sm">
          Confira as monitorias disponíveis para esta semana
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Monitorias Disponíveis"
          value={totalDisponíveis}
          loading={loadingStats}
          icon={<BookOpen className="h-4 w-4 text-secondary" />}
        />
        <StatCard
          title="Meus Agendamentos"
          value={totalAgendamentos}
          loading={loadingStats}
          icon={<CalendarDays className="h-4 w-4 text-accent" />}
        />
        <StatCard
          title="Avaliações Feitas"
          value={totalAvaliacoes}
          loading={loadingStats}
          icon={<Star className="h-4 w-4 text-secondary" />}
        />
      </div>

      {/* Próximas monitorias */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Próximas Monitorias</h3>
        <div className="space-y-2">
          {loadingProximas ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[66px] rounded-lg" />
            ))
          ) : proximas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma monitoria agendada no momento.
            </p>
          ) : (
            proximas.map((m) => {
              const dataHora = new Date(m.data_hora_inicio);
              const dataFmt = dataHora.toLocaleDateString("pt-BR");
              const horaFmt = dataHora.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const nomeDisciplina = m.disciplinas?.nome ?? "—";

              return (
                <Card key={m.id} className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-lg gradient-gold flex items-center justify-center text-secondary-foreground font-bold text-sm shrink-0">
                    {nomeDisciplina.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{nomeDisciplina}</p>
                    <p className="text-xs text-muted-foreground">
                      {dataFmt} às {horaFmt} — {m.local}
                    </p>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para os cards de stat
function StatCard({
  title,
  value,
  loading,
  icon,
}: {
  title: string;
  value: number | null;
  loading: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}