import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, CalendarDays, BookOpen } from "lucide-react";

export default function CoordenadorRelatorios() {
  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatorios();
  }, []);

  async function fetchRelatorios() {
    setLoading(true);
    const { data } = await supabase
      .from("relatorios")
      .select(`*, monitorias(*, disciplinas(nome))`)
      .order("created_at", { ascending: false });
    setRelatorios(data ?? []);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-secondary" />
          Relatórios
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Relatórios enviados pelos monitores</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {relatorios.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-accent" />
                    {r.monitorias?.disciplinas?.nome ?? "Monitoria"}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(r.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.conteudo}</p>
              </CardContent>
            </Card>
          ))}
          {relatorios.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum relatório disponível.</p>
          )}
        </div>
      )}
    </div>
  );
}
