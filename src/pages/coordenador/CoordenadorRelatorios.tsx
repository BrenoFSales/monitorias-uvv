import { mockRelatorios } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CalendarDays, BookOpen } from "lucide-react";

export default function CoordenadorRelatorios() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-secondary" />
          Relatórios
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Relatórios enviados pelos monitores</p>
      </div>

      <div className="space-y-4">
        {mockRelatorios.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" />
                  {r.monitoria?.disciplina || "Monitoria"}
                </CardTitle>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(r.data + "T00:00:00").toLocaleDateString("pt-BR")}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.conteudo}</p>
            </CardContent>
          </Card>
        ))}
        {mockRelatorios.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhum relatório disponível.</p>
        )}
      </div>
    </div>
  );
}
