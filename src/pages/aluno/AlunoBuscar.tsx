import { useState } from "react";
import { mockMonitorias } from "@/data/mockData";
import { MonitoriaCard } from "@/components/MonitoriaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, ChevronRight, GraduationCap, Search } from "lucide-react";

export default function AlunoBuscar() {
  const [selectedCurso, setSelectedCurso] = useState<string | null>(null);
  const [searchCurso, setSearchCurso] = useState("");
  const [searchDisciplina, setSearchDisciplina] = useState("");

  // Step 1 — list of cursos that have monitorias
  const cursosDisponiveis = [...new Set(mockMonitorias.map((m) => m.curso))].sort();
  const cursosFiltrados = cursosDisponiveis.filter((c) =>
    c.toLowerCase().includes(searchCurso.toLowerCase())
  );

  // Step 2 — monitorias filtered by selected curso
  const monitoriasDoCurso = selectedCurso
    ? mockMonitorias.filter(
        (m) =>
          m.curso === selectedCurso &&
          (m.disciplina.toLowerCase().includes(searchDisciplina.toLowerCase()) ||
            m.local.toLowerCase().includes(searchDisciplina.toLowerCase()))
      )
    : [];

  const countByCurso = (curso: string) =>
    mockMonitorias.filter((m) => m.curso === curso && m.status === "aberta").length;

  const handleInscrever = () => {
    toast.success("Inscrição realizada com sucesso!", {
      description: "Você receberá uma confirmação por e-mail.",
    });
  };

  if (!selectedCurso) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-secondary" />
            Buscar Monitorias
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Passo 1: selecione o curso para ver as disciplinas disponíveis
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar curso..."
            className="pl-9"
            value={searchCurso}
            onChange={(e) => setSearchCurso(e.target.value)}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cursosFiltrados.map((curso) => (
            <Card
              key={curso}
              className="cursor-pointer hover:shadow-md hover:border-primary transition-all"
              onClick={() => {
                setSelectedCurso(curso);
                setSearchDisciplina("");
              }}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{curso}</p>
                  <p className="text-xs text-muted-foreground">
                    {countByCurso(curso)} monitoria(s) aberta(s)
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
          {cursosFiltrados.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-8">
              Nenhum curso encontrado.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2"
            onClick={() => setSelectedCurso(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Trocar curso
          </Button>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-secondary" />
            {selectedCurso}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Passo 2: escolha uma disciplina para se inscrever
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar disciplina ou local..."
          className="pl-9"
          value={searchDisciplina}
          onChange={(e) => setSearchDisciplina(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {monitoriasDoCurso.map((m) => (
          <MonitoriaCard
            key={m.id}
            monitoria={m}
            actions={
              m.status === "aberta" ? (
                <Button size="sm" className="w-full" onClick={handleInscrever}>
                  Inscrever-se
                </Button>
              ) : null
            }
          />
        ))}
        {monitoriasDoCurso.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-8">
            Nenhuma monitoria encontrada para este curso.
          </p>
        )}
      </div>
    </div>
  );
}
