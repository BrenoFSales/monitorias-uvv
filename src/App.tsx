import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import AlunoDashboard from "@/pages/aluno/AlunoDashboard";
import AlunoBuscar from "@/pages/aluno/AlunoBuscar";
import AlunoAgendamentos from "@/pages/aluno/AlunoAgendamentos";
import MonitorDashboard from "@/pages/monitor/MonitorDashboard";
import MonitorMonitorias from "@/pages/monitor/MonitorMonitorias";
import MonitorPresencas from "@/pages/monitor/MonitorPresencas";
import CoordenadorDashboard from "@/pages/coordenador/CoordenadorDashboard";
import CoordenadorRelatorios from "@/pages/coordenador/CoordenadorRelatorios";
import CoordenadorMonitores from "@/pages/coordenador/CoordenadorMonitores";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={`/${user?.role || "aluno"}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user?.role || "aluno"}`} replace /> : <LoginPage />} />
      <Route path="/cadastro" element={isAuthenticated ? <Navigate to={`/${user?.role || "aluno"}`} replace /> : <SignupPage />} />

      <Route path="/aluno" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<AlunoDashboard />} />
        <Route path="buscar" element={<AlunoBuscar />} />
        <Route path="agendamentos" element={<AlunoAgendamentos />} />
      </Route>

      <Route path="/monitor" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<MonitorDashboard />} />
        <Route path="monitorias" element={<MonitorMonitorias />} />
        <Route path="presencas" element={<MonitorPresencas />} />
      </Route>

      <Route path="/coordenador" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<CoordenadorDashboard />} />
        <Route path="relatorios" element={<CoordenadorRelatorios />} />
        <Route path="monitores" element={<CoordenadorMonitores />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
