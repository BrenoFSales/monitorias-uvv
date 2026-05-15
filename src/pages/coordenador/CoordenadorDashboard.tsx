import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { FileText, Users, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoordenadorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ monitorias: 0, relatorios: 0, monitores: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    const [{ count: monitorias }, { count: relatorios }, { count: monitores }] = await Promise.all([
      supabase.from("monitorias").select("*", { count: "exact", head: true }),
      supabase.from("relatorios").select("*", { count: "exact", head: true }),
      supabase.from("monitores").select("*", { count: "exact", head: true }),
    ]);
    setStats({
      monitorias: monitorias ?? 0,
      relatorios: relatorios ?? 0,
      monitores: monitores ?? 0,
    });
    setLoading(false);
  }

  const primeiroNome = user?.nome?.split(" ")[0] ?? "Coordenador";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Olá, {primeiroNome}! 👋</h2>
        <p className="text-muted-foreground text-sm">Painel de Coordenação</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total de Monitorias"
          value={loading ? null : stats.monitorias}
          icon={<BookOpen className="h-4 w-4 text-secondary" />}
        />
        <StatCard
          title="Relatórios"
          value={loading ? null : stats.relatorios}
          icon={<FileText className="h-4 w-4 text-accent" />}
        />
        <StatCard
          title="Monitores Ativos"
          value={loading ? null : stats.monitores}
          icon={<Users className="h-4 w-4 text-success" />}
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
