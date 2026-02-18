import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";
import GrainDryersPage from "./pages/services/GrainDryers";
import GrainDryersInstallationPage from "./pages/services/GrainDryersInstallation";
import ZavTurnkeyPage from "./pages/services/ZavTurnkey";
import ConveyorsPage from "./pages/services/Conveyors";
import GrainCleaningPage from "./pages/services/GrainCleaning";
import GrainWarehousesPage from "./pages/services/GrainWarehouses";
import HangarsPage from "./pages/services/Hangars";
import DesignPage from "./pages/services/Design";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services/grain-dryers" element={<GrainDryersPage />} />
            <Route path="/services/grain-dryers/installation" element={<GrainDryersInstallationPage />} />
            <Route path="/services/zav-turnkey" element={<ZavTurnkeyPage />} />
            <Route path="/services/conveyors" element={<ConveyorsPage />} />
            <Route path="/services/grain-cleaning" element={<GrainCleaningPage />} />
            <Route path="/services/grain-warehouses" element={<GrainWarehousesPage />} />
            <Route path="/services/hangars" element={<HangarsPage />} />
            <Route path="/services/design" element={<DesignPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
