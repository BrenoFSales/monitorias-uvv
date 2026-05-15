import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Copy, Plus, Star, Users } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const EMPTY_FORM = {
  nome: "",
  email: "",
  matricula: "",
  senha: "",
  disciplina_id: "",
};

export default function CoordenadorMonitores() {
  const [monitores, setMonitores] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});

  useEffect(() => {
    fetchMonitores();
    fetchDisciplinas();
  }, []);

  async function fetchMonitores() {
    setLoading(true);
    const { data: monitoresData } = await supabase
      .from("monitores")
      .select("user_id, score_avaliacao, disciplinas(nome)");

    if (!monitoresData || monitoresData.length === 0) {
      setMonitores([]);
      setLoading(false);
      return;
    }

    const userIds = monitoresData.map((m) => m.user_id);
    const { data: usuariosData } = await supabase
      .from("usuarios")
      .select("id, nome, email")
      .in("id", userIds);

    const usuariosMap = Object.fromEntries((usuariosData ?? []).map((u) => [u.id, u]));
    setMonitores(
      monitoresData.map((m) => ({
        user_id: m.user_id,
        nome: usuariosMap[m.user_id]?.nome ?? "Monitor",
        email: usuariosMap[m.user_id]?.email ?? "—",
        disciplina: (m as any).disciplinas?.nome ?? "—",
        score: m.score_avaliacao,
      }))
    );
    setLoading(false);
  }

  async function fetchDisciplinas() {
    const { data } = await supabase.from("disciplinas").select("id, nome").order("nome");
    setDisciplinas(data ?? []);
  }

  function validate() {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "E-mail inválido";
    if (!form.matricula.trim()) e.matricula = "Matrícula é obrigatória";
    if (form.senha.length < 6) e.senha = "Senha deve ter ao menos 6 caracteres";
    if (!form.disciplina_id) e.disciplina_id = "Selecione uma disciplina";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleCadastrar() {
    if (!validate()) return;
    setSubmitting(true);

    try {
      // Client temporário isolado — não afeta a sessão do coordenador
      const tempClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data: authData, error: authError } = await tempClient.auth.signUp({
        email: form.email.trim(),
        password: form.senha,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("already registered")) {
          toast.error("Este e-mail já está cadastrado no sistema.");
        } else {
          toast.error("Erro ao criar conta.", { description: authError.message });
        }
        return;
      }

      const userId = authData?.user?.id;
      if (!userId) {
        toast.error("Cadastro falhou.", {
          description: 'Verifique se "Confirm email" está desabilitado no Supabase.',
        });
        return;
      }

      // Insere em `usuarios` autenticado como o próprio monitor recém-criado
      const { error: usuarioError } = await tempClient.from("usuarios").insert({
        id: userId,
        nome: form.nome.trim(),
        email: form.email.trim(),
        matricula: form.matricula.trim(),
        role: "monitor",
      });

      if (usuarioError) {
        toast.error("Erro ao salvar dados do monitor.", { description: usuarioError.message });
        return;
      }

      // Insere em `monitores`
      const { error: monitorError } = await tempClient.from("monitores").insert({
        user_id: userId,
        disciplina_id: form.disciplina_id,
        score_avaliacao: null,
      });

      if (monitorError) {
        toast.error("Erro ao vincular disciplina.", { description: monitorError.message });
        return;
      }

      toast.success(`Monitor ${form.nome.trim()} cadastrado com sucesso!`);
      setForm(EMPTY_FORM);
      setErrors({});
      setOpen(false);
      fetchMonitores();
    } finally {
      setSubmitting(false);
    }
  }

  function field(key: keyof typeof EMPTY_FORM, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function gerarSenha() {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#!";
    const senha = Array.from({ length: 10 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    field("senha", senha);
  }

  function copiarSenha() {
    navigator.clipboard.writeText(form.senha);
    toast.success("Senha copiada!");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-secondary" />
            Monitores
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Monitores ativos e suas avaliações</p>
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm(EMPTY_FORM); setErrors({}); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Cadastrar Monitor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Monitor</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome completo</Label>
                <Input
                  value={form.nome}
                  onChange={(e) => field("nome", e.target.value)}
                  placeholder="Ex: Carlos Silva"
                />
                {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
              </div>

              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => field("email", e.target.value)}
                  placeholder="monitor@email.com"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label>Matrícula</Label>
                <Input
                  value={form.matricula}
                  onChange={(e) => field("matricula", e.target.value)}
                  placeholder="Ex: 2024010"
                />
                {errors.matricula && <p className="text-xs text-destructive">{errors.matricula}</p>}
              </div>

              <div className="space-y-2">
                <Label>Disciplina</Label>
                <Select value={form.disciplina_id} onValueChange={(v) => field("disciplina_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinas.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.disciplina_id && <p className="text-xs text-destructive">{errors.disciplina_id}</p>}
              </div>

              <div className="space-y-2">
                <Label>Senha inicial</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.senha}
                    onChange={(e) => field("senha", e.target.value)}
                    placeholder="Mín. 6 caracteres"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={copiarSenha} disabled={!form.senha} title="Copiar senha">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={gerarSenha}>
                  Gerar senha aleatória
                </Button>
                {errors.senha && <p className="text-xs text-destructive">{errors.senha}</p>}
                <p className="text-xs text-muted-foreground">
                  Anote e repasse a senha ao monitor. Ele poderá alterá-la depois.
                </p>
              </div>

              <Button onClick={handleCadastrar} className="w-full" disabled={submitting}>
                {submitting ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : monitores.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Nenhum monitor cadastrado.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {monitores.map((m) => (
            <Card key={m.user_id}>
              <CardHeader>
                <CardTitle className="text-base">{m.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>{m.email}</p>
                <p>Disciplina: {m.disciplina}</p>
                {m.score !== null && m.score !== undefined && (
                  <div className="flex items-center gap-1 pt-1">
                    <Star className="h-4 w-4 text-secondary fill-secondary" />
                    <span className="font-semibold text-foreground">
                      {typeof m.score === "number" ? m.score.toFixed(1) : m.score}
                    </span>
                    <span>/ 5.0</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
