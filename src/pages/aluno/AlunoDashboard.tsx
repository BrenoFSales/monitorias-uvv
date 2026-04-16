import { BookOpen, CalendarDays, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMonitorias, mockInscricoes } from "@/data/mockData";

export default function AlunoDashboard() {
  const proximas = mockMonitorias.filter((m) => m.status === "aberta").slice(0, 3);
  const meusAgendamentos = mockInscricoes.filter((i) => i.aluno_id === "a1");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Olá, João! 👋</h2>
        <p className="text-muted-foreground text-sm">Confira as monitorias disponíveis para esta semana</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monitorias Disponíveis</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{mockMonitorias.filter((m) => m.status === "aberta").length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Meus Agendamentos</CardTitle>
            <CalendarDays className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{meusAgendamentos.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avaliações Feitas</CardTitle>
            <Star className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">1</p></CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Próximas Monitorias</h3>
        <div className="space-y-2">
          {proximas.map((m) => (
            <Card key={m.id} className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-lg gradient-gold flex items-center justify-center text-secondary-foreground font-bold text-sm">
                {m.disciplina.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{m.disciplina}</p>
                <p className="text-xs text-muted-foreground">{new Date(m.data + "T00:00:00").toLocaleDateString("pt-BR")} às {m.horario} — {m.local}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
