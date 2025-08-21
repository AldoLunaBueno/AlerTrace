import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import History from "./pages/History";
import RoyaDetection from "./pages/RoyaDetection";
import Reports from "./pages/Reports";
import FarmInfo from "./pages/FarmInfo";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import RequireAuth from "./auth/RequireAuth";
import { AuthButtons } from "./components/AuthButtons";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="overscroll-y-contain touch-manipulation select-none">
          <AuthButtons />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/roya" element={<RequireAuth><RoyaDetection /></RequireAuth>} />
            <Route path="/charts" element={<RequireAuth><Charts /></RequireAuth>} />
            <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
            <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
            <Route path="/farm" element={<RequireAuth><FarmInfo /></RequireAuth>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
