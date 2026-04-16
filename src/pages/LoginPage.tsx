import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import logoUvv from "@/assets/logo-uvv.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      if (email.includes("monitor")) navigate("/monitor");
      else if (email.includes("coord")) navigate("/coordenador");
      else navigate("/aluno");
    } catch {
      toast.error("Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <img src={logoUvv} alt="UVV" className="h-20 w-20 mx-auto object-contain" />
          <CardTitle className="text-2xl">Monitorias UVV</CardTitle>
          <CardDescription>Faça login para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu.email@uvv.br" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              É aluno e ainda não tem conta?{" "}
              <Link to="/cadastro" className="text-primary font-semibold hover:underline">
                Cadastre-se
              </Link>
            </p>
          </form>
          <div className="mt-6 p-3 rounded-md bg-muted text-xs text-muted-foreground space-y-1">
            <p className="font-semibold">Demo — use um dos e-mails abaixo (senha: 123456):</p>
            <p>Aluno: <span className="font-mono">aluno@uvv.br</span></p>
            <p>Monitor: <span className="font-mono">monitor@uvv.br</span></p>
            <p>Coordenador: <span className="font-mono">coord@uvv.br</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
