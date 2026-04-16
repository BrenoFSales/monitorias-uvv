import { useState } from "react";
import { mockInscricoes, mockMonitorias } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

export default function MonitorPresencas() {
  const minhasMonitorias = mockMonitorias.filter((m) => m.monitor_id === "m1");
  const [selected, setSelected] = useState(minhasMonitorias[0]?.id || "");
  const inscritos = mockInscricoes.filter((i) => i.monitoria_id === selected);
  const [presencas, setPresencas] = useState<Record<string, boolean>>({});

  const togglePresenca = (id: string) => {
    setPresencas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSalvar = () => {
    toast.success("Presenças registradas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-secondary" />
          Registro de Presenças
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Marque a presença dos alunos inscritos</p>
      </div>

      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-full sm:w-72">
          <SelectValue placeholder="Selecione a monitoria" />
        </SelectTrigger>
        <SelectContent>
          {minhasMonitorias.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.disciplina} — {new Date(m.data + "T00:00:00").toLocaleDateString("pt-BR")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alunos Inscritos</CardTitle>
        </CardHeader>
        <CardContent>
          {inscritos.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum aluno inscrito nesta monitoria.</p>
          ) : (
            <div className="space-y-3">
              {inscritos.map((insc) => (
                <div key={insc.id} className="flex items-center gap-3 p-3 rounded-md border">
                  <Checkbox
                    checked={presencas[insc.id] || false}
                    onCheckedChange={() => togglePresenca(insc.id)}
                  />
                  <div>
                    <p className="text-sm font-medium">{insc.aluno_nome || "Aluno"}</p>
                    <p className="text-xs text-muted-foreground">Status: {insc.status}</p>
                  </div>
                </div>
              ))}
              <Button onClick={handleSalvar} className="mt-4">Salvar Presenças</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
