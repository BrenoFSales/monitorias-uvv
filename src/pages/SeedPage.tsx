/**
 * ARQUIVO TEMPORÁRIO — apague após usar
 * Rota: /seed  (remova também em App.tsx)
 */
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const PASSWORD = "Teste@123456";

const TEST_DISCIPLINES = [
  { nome: "Cálculo I",          codigo: "MAT101" },
  { nome: "Programação Web",    codigo: "CC201"  },
  { nome: "Estrutura de Dados", codigo: "CC301"  },
];

const USERS = [
  { nome: "Aluno Teste",       email: "aluno@teste.uvv",       matricula: "2024001", role: "aluno"       } as const,
  { nome: "Monitor Teste",     email: "monitor@teste.uvv",     matricula: "2024002", role: "monitor"     } as const,
  { nome: "Coordenador Teste", email: "coordenador@teste.uvv", matricula: "2024003", role: "coordenador" } as const,
];

type Log = { text: string; type: "info" | "ok" | "skip" | "warn" | "error" | "fatal" };

export default function SeedPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [partialUsers, setPartialUsers] = useState<string[]>([]);

  function addLog(text: string, type: Log["type"] = "info") {
    setLogs((prev) => [...prev, { text, type }]);
  }

  // ── Step 1: garante disciplinas ──────────────────────────────────────────
  async function ensureDisciplinas(): Promise<string | null> {
    const { data: existing } = await supabase
      .from("disciplinas")
      .select("id, nome")
      .limit(1)
      .maybeSingle();

    if (existing) {
      addLog(`Disciplina existente: "${existing.nome}"`, "info");
      return existing.id;
    }

    addLog("Nenhuma disciplina encontrada. Tentando criar...", "info");

    for (const d of TEST_DISCIPLINES) {
      const { data, error } = await supabase
        .from("disciplinas")
        .insert(d)
        .select("id")
        .single();

      if (!error && data) {
        addLog(`Disciplina criada: "${d.nome}"`, "ok");
        return data.id;
      }

      if (error) {
        addLog(`Não foi possível criar disciplina "${d.nome}": ${error.message}`, "warn");
      }
    }

    addLog(
      "RLS impede a criação de disciplinas via anon key.\n" +
      "→ Crie ao menos uma disciplina manualmente no Supabase:\n" +
      "  Table Editor → disciplinas → Insert row",
      "fatal"
    );
    return null;
  }

  // ── Step 2: cria usuário completo via signUp ─────────────────────────────
  async function criarUsuario(
    user: (typeof USERS)[number],
    disciplinaId: string | null
  ) {
    // Verifica existência em `usuarios`
    const { data: emUsuarios } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (emUsuarios) {
      const tabela = { aluno: "alunos", monitor: "monitores", coordenador: "coordenadores" }[user.role];
      const { data: emPerfil } = await supabase
        .from(tabela)
        .select("user_id")
        .eq("user_id", emUsuarios.id)
        .maybeSingle();

      if (emPerfil) {
        addLog(`[${user.role}] ${user.email} — já existe completo, pulando`, "skip");
        return;
      }

      // Usuário parcial: existe em `usuarios` mas não no perfil.
      // O RLS impede completar via anon key sem service role key.
      addLog(
        `[${user.role}] ${user.email} — USUÁRIO PARCIAL DETECTADO\n` +
        `  O perfil de ${user.role} está faltando e não pode ser criado\n` +
        `  sem a service role key por causa do RLS.\n` +
        `  → Delete este usuário no Supabase e rode o seed novamente:\n` +
        `    1. Authentication > Users > delete "${user.email}"\n` +
        `    2. Table Editor > usuarios > delete a linha com email "${user.email}"`,
        "fatal"
      );
      setPartialUsers((prev) => [...prev, user.email]);
      return;
    }

    // Usuário não existe — cria via signUp (mesmo fluxo do SignupPage)
    await supabase.auth.signOut();

    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: user.email,
      password: PASSWORD,
    });

    if (authErr) {
      addLog(`[${user.role}] Erro no auth: ${authErr.message}`, "error");
      return;
    }

    const userId = authData?.user?.id;
    if (!userId) {
      addLog(
        `[${user.role}] Auth não retornou ID.\n` +
        `  → Desabilite "Confirm email" em Authentication > Providers > Email`,
        "fatal"
      );
      return;
    }

    const { error: usuarioErr } = await supabase.from("usuarios").insert({
      id: userId,
      nome: user.nome,
      email: user.email,
      matricula: user.matricula,
      role: user.role,
    });

    if (usuarioErr) {
      addLog(`[${user.role}] Erro em usuarios: ${usuarioErr.message}`, "error");
      return;
    }

    const perfilOk = await insertPerfil(user.role, userId, disciplinaId, addLog);
    if (perfilOk) {
      addLog(`[${user.role}] ${user.email} — criado com sucesso ✓`, "ok");
    }
  }

  // ── main ─────────────────────────────────────────────────────────────────
  async function runSeed() {
    setRunning(true);
    setLogs([]);
    setPartialUsers([]);
    setDone(false);

    const disciplinaId = await ensureDisciplinas();
    addLog("", "info");

    for (const user of USERS) {
      await criarUsuario(user, disciplinaId);
    }

    await supabase.auth.signOut();

    addLog("", "info");
    addLog(`Senha de todos: ${PASSWORD}`, "info");
    setDone(true);
    setRunning(false);
  }

  const colors: Record<Log["type"], string> = {
    ok:    "#4ade80",
    skip:  "#94a3b8",
    warn:  "#facc15",
    error: "#f87171",
    fatal: "#f87171",
    info:  "#d4d4d4",
  };

  return (
    <div style={{ maxWidth: 660, margin: "40px auto", fontFamily: "monospace", padding: "0 16px" }}>
      <h2 style={{ fontSize: 20, marginBottom: 4 }}>🌱 Seed — Usuários de Teste</h2>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
        Cria disciplinas + aluno / monitor / coordenador de teste se ainda não existirem.
      </p>

      {!done && (
        <button
          onClick={runSeed}
          disabled={running}
          style={{
            padding: "8px 20px",
            background: running ? "#ccc" : "#18181b",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: running ? "not-allowed" : "pointer",
            fontSize: 14,
          }}
        >
          {running ? "Executando..." : "Executar Seed"}
        </button>
      )}

      {logs.length > 0 && (
        <pre
          style={{
            marginTop: 20,
            background: "#18181b",
            color: "#d4d4d4",
            padding: 16,
            borderRadius: 8,
            fontSize: 13,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {logs.map((l, i) => (
            <span key={i} style={{ color: colors[l.type], display: "block" }}>
              {l.text}
            </span>
          ))}
        </pre>
      )}

      {done && partialUsers.length > 0 && (
        <div
          style={{
            marginTop: 16,
            background: "#450a0a",
            border: "1px solid #f87171",
            borderRadius: 8,
            padding: 16,
            fontSize: 13,
            color: "#fca5a5",
          }}
        >
          <strong>Ação necessária — usuários parciais:</strong>
          <ol style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>Supabase Dashboard → <strong>Authentication {">"} Users</strong></li>
            <li>Delete os e-mails: {partialUsers.join(", ")}</li>
            <li>Supabase Dashboard → <strong>Table Editor {">"} usuarios</strong></li>
            <li>Delete as linhas com esses e-mails</li>
            <li>Volte aqui e clique <strong>Executar Seed</strong> novamente</li>
          </ol>
        </div>
      )}

      {done && partialUsers.length === 0 && (
        <p style={{ marginTop: 16, color: "#f59e0b", fontSize: 13 }}>
          ✅ Seed completo! Lembre de remover a rota <code>/seed</code> do{" "}
          <code>App.tsx</code> e deletar <code>src/pages/SeedPage.tsx</code>
        </p>
      )}
    </div>
  );
}

async function insertPerfil(
  role: "aluno" | "monitor" | "coordenador",
  userId: string,
  disciplinaId: string | null,
  log: (text: string, type: Log["type"]) => void
): Promise<boolean> {
  if (role === "aluno") {
    const { error } = await supabase.from("alunos").insert({
      user_id: userId,
      curso: "Engenharia de Software",
      periodo: 3,
    });
    if (error) { log(`[aluno] Erro em alunos: ${error.message}`, "error"); return false; }

  } else if (role === "monitor") {
    if (!disciplinaId) {
      log("[monitor] Sem disciplina disponível — crie uma e rode o seed novamente", "fatal");
      return false;
    }
    const { error } = await supabase.from("monitores").insert({
      user_id: userId,
      disciplina_id: disciplinaId,
      score_avaliacao: null,
    });
    if (error) { log(`[monitor] Erro em monitores: ${error.message}`, "error"); return false; }

  } else if (role === "coordenador") {
    const { error } = await supabase.from("coordenadores").insert({
      user_id: userId,
      area_responsavel: "Engenharia de Software",
    });
    if (error) { log(`[coordenador] Erro em coordenadores: ${error.message}`, "error"); return false; }
  }

  return true;
}
