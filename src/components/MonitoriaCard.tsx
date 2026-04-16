import { Monitoria } from "@/types/models";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { CalendarDays, Clock, GraduationCap, MapPin, User } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  monitoria: Monitoria;
  actions?: ReactNode;
}

export function MonitoriaCard({ monitoria, actions }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-base">{monitoria.disciplina}</CardTitle>
            {monitoria.curso && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                {monitoria.curso}
              </p>
            )}
          </div>
          <StatusBadge status={monitoria.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>{new Date(monitoria.data + "T00:00:00").toLocaleDateString("pt-BR")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{monitoria.horario}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{monitoria.local}</span>
        </div>
        {monitoria.monitor_nome && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{monitoria.monitor_nome}</span>
          </div>
        )}
      </CardContent>
      {actions && <CardFooter>{actions}</CardFooter>}
    </Card>
  );
}
