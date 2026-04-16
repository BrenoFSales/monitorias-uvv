import { FileText, Users, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMonitorias, mockRelatorios } from "@/data/mockData";

export default function CoordenadorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Olá, Prof. Mariana! 👋</h2>
        <p className="text-muted-foreground text-sm">Painel de Coordenação</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Monitorias</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{mockMonitorias.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Relatórios</CardTitle>
            <FileText className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{mockRelatorios.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monitores Ativos</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">2</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
