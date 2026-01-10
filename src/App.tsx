import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Menu from "./pages/admin/Menu";
import Customers from "./pages/admin/Customers";
import Staff from "./pages/admin/Staff";
import Settings from "./pages/admin/Settings";
import Placeholder from "./pages/admin/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/loyalty" element={<Placeholder titleAr="الولاء" titleEn="Loyalty" />} />
            <Route path="/promotions" element={<Placeholder titleAr="العروض" titleEn="Promotions" />} />
            <Route path="/tickets" element={<Placeholder titleAr="التذاكر" titleEn="Tickets" />} />
            <Route path="/reports" element={<Placeholder titleAr="التقارير" titleEn="Reports" />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/branches" element={<Placeholder titleAr="الفروع" titleEn="Branches" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
