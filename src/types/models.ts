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
  disciplina: string;
  score_avaliacao: number | null;
}

export interface Coordenador {
  user_id: string;
  area_responsavel: string;
}

export interface Monitoria {
  id: string;
  data: string;
  horario: string;
  local: string;
  curso: string;
  disciplina: string;
  monitor_id: string;
  monitor_nome?: string;
  status?: "aberta" | "lotada" | "concluida";
}

export interface Inscricao {
  id: string;
  aluno_id: string;
  monitoria_id: string;
  status: string;
  monitoria?: Monitoria;
  aluno_nome?: string;
}

export interface Presenca {
  id: string;
  inscricao_id: string;
  presente: boolean;
  monitoria_id: string;
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
  data: string;
  monitoria?: Monitoria;
}
