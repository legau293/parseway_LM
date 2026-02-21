
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ParsewayLayout } from "@/components/layouts/ParsewayLayout";
import Index from "./pages/Index";
import Notebook from "./pages/Notebook";
import Workspace from "./pages/Workspace";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        element={
          <ProtectedRoute fallback={<Auth />}>
            <ParsewayLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/notebook" element={<Notebook />} />
        <Route path="/notebook/:id" element={<Notebook />} />
      </Route>
      <Route
        path="/workspace"
        element={
          <ProtectedRoute fallback={<Auth />}>
            <Workspace />
          </ProtectedRoute>
        }
      />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
