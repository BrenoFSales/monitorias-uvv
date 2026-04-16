import { BookOpen, Users, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMonitorias, mockInscricoes } from "@/data/mockData";

export default function MonitorDashboard() {
  const minhas = mockMonitorias.filter((m) => m.monitor_id === "m1");
  const inscritos = mockInscricoes.filter((i) => minhas.some((m) => m.id === i.monitoria_id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Olá, Carlos! 👋</h2>
        <p className="text-muted-foreground text-sm">Painel do Monitor</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monitorias Ativas</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{minhas.filter((m) => m.status === "aberta").length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Inscritos</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{inscritos.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concluídas</CardTitle>
            <CalendarDays className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{minhas.filter((m) => m.status === "concluida").length}</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
