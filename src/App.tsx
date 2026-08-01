import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import CollectionPage from "./pages/CollectionPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import SizeGuidePage from "./pages/support/SizeGuidePage";
import FAQPage from "./pages/support/FAQPage";
import ShippingPage from "./pages/support/ShippingPage";
import ReturnsPage from "./pages/support/ReturnsPage";
import PrivacyPage from "./pages/support/PrivacyPage";
import TermsPage from "./pages/support/TermsPage";
import GrowthLayout from "./pages/growth/GrowthLayout";
import GrowthOverview from "./pages/growth/Overview";
import CustomerDB360 from "./pages/growth/CustomerDB360";
import KnowledgeBasePage from "./pages/growth/KnowledgeBasePage";
import CampaignBuilder from "./pages/growth/CampaignBuilder";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <AuthProvider>
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:handle" element={<ProductPage />} />
                <Route path="/collections/:handle" element={<CollectionPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/size-guide" element={<SizeGuidePage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/growth" element={<GrowthLayout />}>
                  <Route index element={<GrowthOverview />} />
                  <Route path="db360" element={<CustomerDB360 />} />
                  <Route path="knowledge-base" element={<KnowledgeBasePage />} />
                  <Route path="campaigns" element={<CampaignBuilder />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
