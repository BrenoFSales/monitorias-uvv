import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { MonitoriaCard } from "@/components/MonitoriaCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertCircle, BookOpen, Plus } from "lucide-react";

export default function MonitorMonitorias() {
  const { user } = useAuth();
  const [monitorias, setMonitorias] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [semPerfil, setSemPerfil] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    disciplina_id: "",
    data_hora_inicio: "",
    data_hora_fim: "",
    local: "",
    vagas: "20",
  });

  useEffect(() => {
    if (!user) return;
    fetchTudo();
  }, [user]);

  async function fetchTudo() {
    setLoading(true);

    // Verifica se o usuário tem perfil na tabela `monitores`
    const { data: perfil } = await supabase
      .from("monitores")
      .select("user_id")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (!perfil) {
      setSemPerfil(true);
      setLoading(false);
      return;
    }

    await Promise.all([fetchMonitorias(), fetchDisciplinas()]);
    setLoading(false);
  }

  async function fetchMonitorias() {
    const { data } = await supabase
      .from("monitorias")
      .select(`*, disciplinas(nome)`)
      .eq("monitor_id", user!.id)
      .order("data_hora_inicio", { ascending: false });
    setMonitorias(data ?? []);
  }

  async function fetchDisciplinas() {
    const { data } = await supabase.from("disciplinas").select("id, nome").order("nome");
    setDisciplinas(data ?? []);
  }

  const handleCreate = async () => {
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("monitorias").insert({
      monitor_id: user.id,
      disciplina_id: form.disciplina_id,
      data_hora_inicio: form.data_hora_inicio,
      data_hora_fim: form.data_hora_fim || null,
      local: form.local,
      vagas: Number(form.vagas),
      status: "agendada",
    });
    if (error) {
      if (error.code === "23503") {
        toast.error("Perfil de monitor não encontrado no banco.", {
          description: "Seu cadastro está incompleto. Fale com o coordenador.",
        });
      } else {
        toast.error("Erro ao cadastrar monitoria.", { description: error.message });
      }
    } else {
      toast.success("Monitoria cadastrada com sucesso!");
      setForm({ disciplina_id: "", data_hora_inicio: "", data_hora_fim: "", local: "", vagas: "20" });
      setOpen(false);
      fetchMonitorias();
    }
    setSubmitting(false);
  };

  const isValid = form.disciplina_id && form.data_hora_inicio && form.local;

  if (semPerfil) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-secondary" />
            Minhas Monitorias
          </h2>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold">Perfil de monitor incompleto</p>
            <p className="text-muted-foreground">
              Seu usuário não possui registro na tabela <code>monitores</code>. Isso
              acontece quando o cadastro não foi concluído corretamente.
            </p>
            <p className="text-muted-foreground">
              Solicite ao coordenador que verifique seu cadastro no sistema.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nova Monitoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Monitoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Disciplina</Label>
                <Select
                  value={form.disciplina_id}
                  onValueChange={(v) => setForm({ ...form, disciplina_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinas.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Início</Label>
                <Input
                  type="datetime-local"
                  value={form.data_hora_inicio}
                  onChange={(e) => setForm({ ...form, data_hora_inicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fim (opcional)</Label>
                <Input
                  type="datetime-local"
                  value={form.data_hora_fim}
                  onChange={(e) => setForm({ ...form, data_hora_fim: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Local</Label>
                <Input
                  value={form.local}
                  onChange={(e) => setForm({ ...form, local: e.target.value })}
                  placeholder="Ex: Sala 201 - Bloco A"
                />
              </div>
              <div className="space-y-2">
                <Label>Vagas</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.vagas}
                  onChange={(e) => setForm({ ...form, vagas: e.target.value })}
                />
              </div>
              <Button
                onClick={handleCreate}
                className="w-full"
                disabled={!isValid || submitting}
              >
                {submitting ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {monitorias.map((m) => (
            <MonitoriaCard key={m.id} monitoria={m} />
          ))}
          {monitorias.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-8">
              Nenhuma monitoria cadastrada.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
