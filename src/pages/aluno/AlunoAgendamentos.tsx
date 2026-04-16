import { useState } from "react";
import { mockInscricoes, mockMonitorias } from "@/data/mockData";
import { MonitoriaCard } from "@/components/MonitoriaCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Star } from "lucide-react";
import { toast } from "sonner";

export default function AlunoAgendamentos() {
  const meusAgendamentos = mockInscricoes.filter((i) => i.aluno_id === "a1");
  const [nota, setNota] = useState("5");
  const [comentario, setComentario] = useState("");

  const handleAvaliar = () => {
    toast.success("Avaliação enviada com sucesso!");
    setNota("5");
    setComentario("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-secondary" />
          Meus Agendamentos
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Acompanhe suas inscrições em monitorias</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meusAgendamentos.map((insc) => {
          const monitoria = insc.monitoria || mockMonitorias.find((m) => m.id === insc.monitoria_id);
          if (!monitoria) return null;
          const isPast = monitoria.status === "concluida";
          return (
            <MonitoriaCard
              key={insc.id}
              monitoria={monitoria}
              actions={
                isPast ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="w-full gap-2">
                        <Star className="h-4 w-4" /> Avaliar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Avaliar Monitoria</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Nota</Label>
                          <Select value={nota} onValueChange={setNota}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <SelectItem key={n} value={String(n)}>{n} estrela{n > 1 ? "s" : ""}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Comentário</Label>
                          <Textarea value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Como foi sua experiência?" />
                        </div>
                        <Button onClick={handleAvaliar} className="w-full">Enviar Avaliação</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <span className="text-xs text-muted-foreground">Status: {insc.status}</span>
                )
              }
            />
          );
        })}
        {meusAgendamentos.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-8">Nenhum agendamento encontrado.</p>
        )}
      </div>
    </div>
  );
}
