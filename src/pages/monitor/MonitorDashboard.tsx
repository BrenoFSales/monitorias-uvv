import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { BookOpen, CalendarDays, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MonitorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ ativas: 0, inscritos: 0, concluidas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchStats();
  }, [user]);

  async function fetchStats() {
    setLoading(true);

    const { data: monitorias } = await supabase
      .from("monitorias")
      .select("id, status")
      .eq("monitor_id", user!.id);

    const ids = (monitorias ?? []).map((m) => m.id);
    const ativas = (monitorias ?? []).filter((m) => m.status === "agendada").length;
    const concluidas = (monitorias ?? []).filter((m) => m.status === "concluida").length;

    let inscritos = 0;
    if (ids.length > 0) {
      const { count } = await supabase
        .from("inscricoes")
        .select("*", { count: "exact", head: true })
        .in("monitoria_id", ids);
      inscritos = count ?? 0;
    }

    setStats({ ativas, inscritos, concluidas });
    setLoading(false);
  }

  const primeiroNome = user?.nome?.split(" ")[0] ?? "Monitor";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Olá, {primeiroNome}! 👋</h2>
        <p className="text-muted-foreground text-sm">Painel do Monitor</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Monitorias Ativas"
          value={loading ? null : stats.ativas}
          icon={<BookOpen className="h-4 w-4 text-secondary" />}
        />
        <StatCard
          title="Total de Inscritos"
          value={loading ? null : stats.inscritos}
          icon={<Users className="h-4 w-4 text-accent" />}
        />
        <StatCard
          title="Concluídas"
          value={loading ? null : stats.concluidas}
          icon={<CalendarDays className="h-4 w-4 text-success" />}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | null;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}
