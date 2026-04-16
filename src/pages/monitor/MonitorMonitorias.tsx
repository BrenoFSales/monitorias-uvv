import { useState } from "react";
import { mockMonitorias } from "@/data/mockData";
import { MonitoriaCard } from "@/components/MonitoriaCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen, Plus } from "lucide-react";
import { Monitoria } from "@/types/models";

export default function MonitorMonitorias() {
  const [monitorias, setMonitorias] = useState(mockMonitorias.filter((m) => m.monitor_id === "m1"));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ curso: "", disciplina: "", data: "", horario: "", local: "" });

  const handleCreate = () => {
    const nova: Monitoria = {
      id: String(Date.now()),
      ...form,
      monitor_id: "m1",
      monitor_nome: "Carlos Silva",
      status: "aberta",
    };
    setMonitorias((prev) => [nova, ...prev]);
    toast.success("Monitoria cadastrada com sucesso!");
    setForm({ curso: "", disciplina: "", data: "", horario: "", local: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-secondary" />
            Minhas Monitorias
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Gerencie seus horários de monitoria</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Nova Monitoria</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar Monitoria</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Curso</Label>
                <Input value={form.curso} onChange={(e) => setForm({ ...form, curso: e.target.value })} placeholder="Ex: Engenharia de Software" />
              </div>
              <div className="space-y-2">
                <Label>Disciplina</Label>
                <Input value={form.disciplina} onChange={(e) => setForm({ ...form, disciplina: e.target.value })} placeholder="Ex: Cálculo I" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Horário</Label>
                  <Input type="time" value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Local</Label>
                <Input value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} placeholder="Ex: Sala 201 - Bloco A" />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={!form.curso || !form.disciplina || !form.data || !form.horario || !form.local}>
                Cadastrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {monitorias.map((m) => <MonitoriaCard key={m.id} monitoria={m} />)}
      </div>
    </div>
  );
}
