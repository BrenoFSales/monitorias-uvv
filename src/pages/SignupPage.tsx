import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import logoUvv from "@/assets/logo-uvv.png";
import { CURSOS } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    matricula: "",
    curso: "",
    periodo: "",
    password: "",
    confirmPassword: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (form.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (form.matricula.length !== 9) {
      toast.error("A matrícula deve ter exatamente 9 caracteres");
      return;
    }

    setLoading(true);
    try {
      // 1. Cria usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error("Erro ao criar usuário");

      // 2. Insere na tabela `usuarios`
      const { error: userError } = await supabase.from("usuarios").insert({
        id: userId,
        nome: form.nome,
        email: form.email,
        matricula: form.matricula,
        role: "aluno",
      });
      if (userError) throw userError;

      // 3. Insere na tabela `alunos`
      const { error: alunoError } = await supabase.from("alunos").insert({
        user_id: userId,
        curso: form.curso,
        periodo: Number(form.periodo),
        matricula: form.matricula,
      });
      if (alunoError) throw alunoError;

      toast.success("Cadastro realizado!", {
        description: "Verifique seu e-mail e faça login.",
      });
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const valid =
    form.nome &&
    form.email &&
    form.matricula &&
    form.curso &&
    form.periodo &&
    form.password &&
    form.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <Card className="w-full max-w-lg animate-fade-in">
        <CardHeader className="text-center space-y-3">
          <img src={logoUvv} alt="UVV" className="h-16 w-16 mx-auto object-contain" />
          <CardTitle className="text-2xl">Cadastro de Aluno</CardTitle>
          <CardDescription>
            Crie sua conta para se inscrever em monitorias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" value={form.nome} onChange={update("nome")} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail institucional</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@uvv.br"
                  value={form.email}
                  onChange={update("email")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  placeholder="2024XXXX"
                  value={form.matricula}
                  onChange={update("matricula")}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <div className="space-y-2">
                <Label htmlFor="curso">Curso</Label>
                <Select
                  value={form.curso}
                  onValueChange={(v) => setForm((f) => ({ ...f, curso: v }))}
                >
                  <SelectTrigger id="curso">
                    <SelectValue placeholder="Selecione seu curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURSOS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodo">Período</Label>
                <Input
                  id="periodo"
                  type="number"
                  min={1}
                  max={12}
                  className="w-24"
                  value={form.periodo}
                  onChange={update("periodo")}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={form.password}
                  onChange={update("password")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmar senha</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••"
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!valid || loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>

            <Button asChild variant="ghost" className="w-full" type="button">
              <Link to="/login">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar para o login
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground text-center pt-2">
              Apenas alunos podem se cadastrar. Monitores são cadastrados pelo coordenador
              e coordenadores são incluídos diretamente pela equipe acadêmica.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
