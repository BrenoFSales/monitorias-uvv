import { Monitoria } from "@/types/models";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  aberta: { label: "Aberta", className: "bg-success text-success-foreground" },
  lotada: { label: "Lotada", className: "bg-warning text-warning-foreground" },
  concluida: { label: "Concluída", className: "bg-muted text-muted-foreground" },
};

export function StatusBadge({ status }: { status: Monitoria["status"] }) {
  const config = statusConfig[status || "aberta"];
  return <Badge className={config.className}>{config.label}</Badge>;
}
