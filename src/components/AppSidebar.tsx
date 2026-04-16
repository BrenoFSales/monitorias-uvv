import { BookOpen, CalendarDays, ClipboardList, FileText, Home, LogOut, Users } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logoUvv from "@/assets/logo-uvv.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuAluno = [
  { title: "Início", url: "/aluno", icon: Home },
  { title: "Buscar Monitorias", url: "/aluno/buscar", icon: BookOpen },
  { title: "Meus Agendamentos", url: "/aluno/agendamentos", icon: CalendarDays },
];

const menuMonitor = [
  { title: "Início", url: "/monitor", icon: Home },
  { title: "Minhas Monitorias", url: "/monitor/monitorias", icon: BookOpen },
  { title: "Presenças", url: "/monitor/presencas", icon: ClipboardList },
];

const menuCoordenador = [
  { title: "Início", url: "/coordenador", icon: Home },
  { title: "Relatórios", url: "/coordenador/relatorios", icon: FileText },
  { title: "Monitores", url: "/coordenador/monitores", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout } = useAuth();

  const role = user?.role;
  const items = role === "monitor" ? menuMonitor : role === "coordenador" ? menuCoordenador : menuAluno;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-3 px-4 py-5">
          <img src={logoUvv} alt="UVV" className="h-10 w-10 rounded-full object-contain bg-sidebar-foreground/10" />
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold text-sidebar-foreground">Monitorias UVV</h2>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{role}</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="hover:bg-sidebar-accent text-sidebar-foreground/70">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && user && (
          <div className="px-4 pb-4">
            <p className="text-xs text-sidebar-foreground/50 truncate">{user.nome}</p>
            <p className="text-xs text-sidebar-foreground/40 truncate">{user.email}</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
