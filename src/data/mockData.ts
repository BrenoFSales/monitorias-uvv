import { Monitoria, Inscricao, Relatorio } from "@/types/models";

export const CURSOS = [
  "Engenharia de Software",
  "Engenharia Civil",
  "Direito",
  "Medicina",
  "Administração",
  "Psicologia",
  "Arquitetura e Urbanismo",
  "Ciência da Computação",
];

export const mockMonitorias: Monitoria[] = [
  {
    id: "1",
    data: "2026-04-14",
    horario: "14:00",
    local: "Sala 201 - Bloco A",
    curso: "Engenharia de Software",
    disciplina: "Cálculo I",
    monitor_id: "m1",
    monitor_nome: "Carlos Silva",
    status: "aberta",
  },
  {
    id: "2",
    data: "2026-04-15",
    horario: "10:00",
    local: "Laboratório 3",
    curso: "Engenharia de Software",
    disciplina: "Programação Web",
    monitor_id: "m1",
    monitor_nome: "Carlos Silva",
    status: "aberta",
  },
  {
    id: "3",
    data: "2026-04-10",
    horario: "16:00",
    local: "Sala 105 - Bloco B",
    curso: "Ciência da Computação",
    disciplina: "Estrutura de Dados",
    monitor_id: "m2",
    monitor_nome: "Ana Souza",
    status: "concluida",
  },
  {
    id: "4",
    data: "2026-04-16",
    horario: "09:00",
    local: "Sala 302 - Bloco C",
    curso: "Engenharia Civil",
    disciplina: "Cálculo I",
    monitor_id: "m2",
    monitor_nome: "Ana Souza",
    status: "lotada",
  },
  {
    id: "5",
    data: "2026-04-17",
    horario: "15:00",
    local: "Sala 410 - Bloco D",
    curso: "Direito",
    disciplina: "Direito Constitucional",
    monitor_id: "m3",
    monitor_nome: "Beatriz Lima",
    status: "aberta",
  },
  {
    id: "6",
    data: "2026-04-18",
    horario: "11:00",
    local: "Anfiteatro 2",
    curso: "Medicina",
    disciplina: "Anatomia Humana",
    monitor_id: "m4",
    monitor_nome: "Rafael Costa",
    status: "aberta",
  },
];

export const mockInscricoes: Inscricao[] = [
  {
    id: "i1",
    aluno_id: "a1",
    monitoria_id: "1",
    status: "confirmada",
    aluno_nome: "João Aluno",
    monitoria: mockMonitorias[0],
  },
  {
    id: "i2",
    aluno_id: "a1",
    monitoria_id: "3",
    status: "confirmada",
    aluno_nome: "João Aluno",
    monitoria: mockMonitorias[2],
  },
  {
    id: "i3",
    aluno_id: "a2",
    monitoria_id: "1",
    status: "confirmada",
    aluno_nome: "Maria Estudante",
  },
];

export const mockRelatorios: Relatorio[] = [
  {
    id: "r1",
    monitoria_id: "3",
    conteudo: "Aula focada em revisão de listas encadeadas. 8 alunos presentes. Dúvidas principais sobre ponteiros e alocação dinâmica.",
    data: "2026-04-10",
    monitoria: mockMonitorias[2],
  },
];
