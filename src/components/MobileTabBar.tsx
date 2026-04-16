import { BookOpen, CalendarDays, ClipboardList, FileText, Home, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const tabsAluno = [
  { title: "Início", url: "/aluno", icon: Home },
  { title: "Buscar", url: "/aluno/buscar", icon: BookOpen },
  { title: "Agenda", url: "/aluno/agendamentos", icon: CalendarDays },
];

const tabsMonitor = [
  { title: "Início", url: "/monitor", icon: Home },
  { title: "Monitorias", url: "/monitor/monitorias", icon: BookOpen },
  { title: "Presenças", url: "/monitor/presencas", icon: ClipboardList },
];

const tabsCoordenador = [
  { title: "Início", url: "/coordenador", icon: Home },
  { title: "Relatórios", url: "/coordenador/relatorios", icon: FileText },
  { title: "Monitores", url: "/coordenador/monitores", icon: Users },
];

export function MobileTabBar() {
  const { user } = useAuth();
  const role = user?.role;
  const tabs = role === "monitor" ? tabsMonitor : role === "coordenador" ? tabsCoordenador : tabsAluno;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-primary text-primary-foreground border-t border-primary/40 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
      aria-label="Navegação principal"
    >
      <ul className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => (
          <li key={tab.url} className="flex-1">
            <NavLink
              to={tab.url}
              end
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2 rounded-lg mx-1 transition-colors",
                  isActive
                    ? "bg-primary-foreground/15 text-secondary"
                    : "text-primary-foreground/80 hover:text-primary-foreground"
                )
              }
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[11px] font-medium">{tab.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
