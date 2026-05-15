import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  agendada: { label: "Aberta", className: "bg-success text-success-foreground" },
  aberta: { label: "Aberta", className: "bg-success text-success-foreground" },
  lotada: { label: "Lotada", className: "bg-warning text-warning-foreground" },
  concluida: { label: "Concluída", className: "bg-muted text-muted-foreground" },
};

export function StatusBadge({ status }: { status?: string }) {
  const config = statusConfig[status ?? ""] ?? {
    label: status ?? "—",
    className: "bg-muted text-muted-foreground",
  };
  return <Badge className={config.className}>{config.label}</Badge>;
}
