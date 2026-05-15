import { Monitoria } from "@/types/models";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  monitoria: Monitoria;
  actions?: ReactNode;
}

export function MonitoriaCard({ monitoria, actions }: Props) {
  const nomeDisciplina = monitoria.disciplinas?.nome ?? "—";
  const nomeMonitor = monitoria.monitores?.usuarios?.nome ?? monitoria.monitor_nome;
  const dataHora = new Date(monitoria.data_hora_inicio);
  const dataFmt = dataHora.toLocaleDateString("pt-BR");
  const horaFmt = dataHora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{nomeDisciplina}</CardTitle>
          <StatusBadge status={monitoria.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>{dataFmt}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{horaFmt}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{monitoria.local}</span>
        </div>
        {nomeMonitor && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{nomeMonitor}</span>
          </div>
        )}
      </CardContent>
      {actions && <CardFooter>{actions}</CardFooter>}
    </Card>
  );
}
