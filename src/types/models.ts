export type UserRole = "aluno" | "monitor" | "coordenador";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  matricula: string;
}

export interface Aluno {
  user_id: string;
  curso: string;
  periodo: number;
}

export interface Monitor {
  user_id: string;
  disciplina_id: string;
  score_avaliacao: number | null;
}

export interface Coordenador {
  user_id: string;
  area_responsavel: string;
}

export interface Disciplina {
  id: string;
  nome: string;
  codigo?: string;
}

export interface Monitoria {
  id: string;
  monitor_id: string;
  disciplina_id: string;
  data_hora_inicio: string;
  data_hora_fim?: string;
  local: string;
  vagas?: number;
  status: string;
  created_at?: string;
  // Joined fields
  disciplinas?: { nome: string; codigo?: string };
  monitores?: { score_avaliacao?: number; usuarios?: { nome: string } };
  monitor_nome?: string;
}

export interface Inscricao {
  id: string;
  aluno_id: string;
  monitoria_id: string;
  status: string;
  presente: boolean;
  created_at?: string;
  monitorias?: Monitoria;
  aluno_nome?: string;
}

export interface Avaliacao {
  id: string;
  nota: number;
  comentario: string;
  aluno_id: string;
  monitoria_id: string;
}

export interface Relatorio {
  id: string;
  monitoria_id: string;
  conteudo: string;
  created_at?: string;
  monitorias?: Monitoria;
}
