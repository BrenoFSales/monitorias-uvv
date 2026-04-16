import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star } from "lucide-react";

const monitores = [
  { nome: "Carlos Silva", disciplina: "Cálculo I / Programação Web", score: 4.5 },
  { nome: "Ana Souza", disciplina: "Estrutura de Dados / Cálculo I", score: 4.8 },
];

export default function CoordenadorMonitores() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-secondary" />
          Monitores
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Monitores ativos e suas avaliações</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {monitores.map((m) => (
          <Card key={m.nome}>
            <CardHeader>
              <CardTitle className="text-base">{m.nome}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Disciplinas: {m.disciplina}</p>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-secondary fill-secondary" />
                <span className="font-semibold text-foreground">{m.score}</span>
                <span>/ 5.0</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
