import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import CatalogCategory from "./pages/CatalogCategory";
import CatalogProduct from "./pages/CatalogProduct";
import AdminLogin from "./pages/AdminLogin";
import AdminCatalog from "./pages/AdminCatalog";
import AdminProducts from "./pages/AdminProducts";
import ScrollToTop from "./components/ScrollToTop";

const App = () => (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:primarySlug/*" element={<CatalogCategory />} />
        <Route path="/product/*" element={<CatalogProduct />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/catalog" element={<AdminCatalog />} />
        <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
);

export default App;
