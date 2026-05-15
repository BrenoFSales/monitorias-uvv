import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

export default function MonitorPresencas() {
  const { user } = useAuth();
  const [monitorias, setMonitorias] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [inscritos, setInscritos] = useState<any[]>([]);
  const [presencas, setPresencas] = useState<Record<string, boolean>>({});
  const [loadingMonitorias, setLoadingMonitorias] = useState(true);
  const [loadingInscritos, setLoadingInscritos] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchMonitorias();
  }, [user]);

  async function fetchMonitorias() {
    setLoadingMonitorias(true);
    const { data } = await supabase
      .from("monitorias")
      .select("id, data_hora_inicio, disciplinas(nome)")
      .eq("monitor_id", user!.id)
      .order("data_hora_inicio", { ascending: false });
    const list = data ?? [];
    setMonitorias(list);
    if (list.length > 0) {
      setSelected(list[0].id);
      await fetchInscritos(list[0].id);
    }
    setLoadingMonitorias(false);
  }

  async function fetchInscritos(monitoriaId: string) {
    setLoadingInscritos(true);
    const { data: inscricoesData } = await supabase
      .from("inscricoes")
      .select("id, presente, status, aluno_id")
      .eq("monitoria_id", monitoriaId);

    const list = inscricoesData ?? [];

    if (list.length > 0) {
      const alunoIds = list.map((i) => i.aluno_id);
      const { data: usuariosData } = await supabase
        .from("usuarios")
        .select("id, nome")
        .in("id", alunoIds);

      const nomesMap = Object.fromEntries((usuariosData ?? []).map((u) => [u.id, u.nome]));
      const inscritosComNome = list.map((i) => ({
        ...i,
        aluno_nome: nomesMap[i.aluno_id] ?? "Aluno",
      }));
      setInscritos(inscritosComNome);
      const inicial: Record<string, boolean> = {};
      inscritosComNome.forEach((i) => {
        inicial[i.id] = i.presente ?? false;
      });
      setPresencas(inicial);
    } else {
      setInscritos([]);
      setPresencas({});
    }
    setLoadingInscritos(false);
  }

  const handleMonitoriaChange = async (id: string) => {
    setSelected(id);
    await fetchInscritos(id);
  };

  const togglePresenca = (id: string) => {
    setPresencas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSalvar = async () => {
    setSaving(true);
    const updates = Object.entries(presencas).map(([id, presente]) =>
      supabase.from("inscricoes").update({ presente }).eq("id", id)
    );
    const results = await Promise.all(updates);
    const hasError = results.some(({ error }) => error);
    if (hasError) {
      toast.error("Erro ao salvar presenças.");
    } else {
      toast.success("Presenças registradas com sucesso!");
    }
    setSaving(false);
  };

  if (loadingMonitorias) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-secondary" />
          Registro de Presenças
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Marque a presença dos alunos inscritos</p>
      </div>

      {monitorias.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhuma monitoria cadastrada.</p>
      ) : (
        <>
          <Select value={selected} onValueChange={handleMonitoriaChange}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Selecione a monitoria" />
            </SelectTrigger>
            <SelectContent>
              {monitorias.map((m) => {
                const dataHora = new Date(m.data_hora_inicio);
                const dataFmt = dataHora.toLocaleDateString("pt-BR");
                const disciplina = (m as any).disciplinas?.nome ?? "Monitoria";
                return (
                  <SelectItem key={m.id} value={m.id}>
                    {disciplina} — {dataFmt}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alunos Inscritos</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingInscritos ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-md" />
                  ))}
                </div>
              ) : inscritos.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhum aluno inscrito nesta monitoria.
                </p>
              ) : (
                <div className="space-y-3">
                  {inscritos.map((insc) => (
                    <div key={insc.id} className="flex items-center gap-3 p-3 rounded-md border">
                      <Checkbox
                        checked={presencas[insc.id] ?? false}
                        onCheckedChange={() => togglePresenca(insc.id)}
                      />
                      <div>
                        <p className="text-sm font-medium">{insc.aluno_nome}</p>
                        <p className="text-xs text-muted-foreground">Status: {insc.status}</p>
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleSalvar} disabled={saving} className="mt-4">
                    {saving ? "Salvando..." : "Salvar Presenças"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
