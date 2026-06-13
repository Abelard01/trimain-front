import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useReports } from "@/hooks/useReports";
import HomeScreen from "./pages/HomeScreen";
import CameraScreen from "./pages/CameraScreen";
import ReportCreation from "./pages/ReportCreation";
import ReportDetail from "./pages/ReportDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { reports, addReport, getReport, deleteReport, ready } = useReports();

  if (!ready) return null;

  return (
    <Routes>
      <Route path="/" element={<HomeScreen reports={reports} />} />
      <Route path="/camera" element={<CameraScreen />} />
      <Route path="/create" element={<ReportCreation onSubmit={addReport} />} />
      <Route path="/report/:id" element={<ReportDetail getReport={getReport} onDelete={deleteReport} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
