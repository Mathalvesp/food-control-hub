
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Ingredientes from "./pages/Ingredientes";
import FichaTecnica from "./pages/FichaTecnica";
import Receitas from "./pages/Receitas";
import Estoque from "./pages/Estoque";
import Configuracoes from "./pages/Configuracoes";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="ingredientes" element={<Ingredientes />} />
            <Route path="ficha-tecnica" element={<FichaTecnica />} />
            <Route path="receitas" element={<Receitas />} />
            <Route path="estoque" element={<Estoque />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
