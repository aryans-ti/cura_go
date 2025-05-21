import React, { useEffect, useRef } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ThemeProvider from "./providers/ThemeProvider";
import ThemeListener from "./providers/ThemeListener";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DoctorsDirectory from "./pages/DoctorsDirectory";
import DoctorProfile from "./pages/DoctorProfile";
import PatientDashboard from "./pages/PatientDashboard";
import AboutUs from "./pages/AboutUs";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HealthAssistant from "./pages/HealthAssistant";
import TestScreen from "./components/TestScreen";

const queryClient = new QueryClient();

// Scroll component that manages scroll position during navigation
function ScrollManager() {
  const { pathname } = useLocation();
  const lastPathRef = useRef<string>(pathname);

  useEffect(() => {
    // Critical routes that should always scroll to top
    const criticalRoutes = ['/', '/health-assistant'];
    
    // If route has changed
    if (lastPathRef.current !== pathname) {
      // If it's a critical route or route change, force scroll to top
      if (criticalRoutes.includes(pathname)) {
        // Immediate scroll to top
        window.scrollTo(0, 0);
        
        // Additional scroll to top with slight delay to ensure it works
        setTimeout(() => window.scrollTo(0, 0), 10);
        setTimeout(() => window.scrollTo(0, 0), 50);
      } else {
        // For other routes, just do a single scroll to top
        window.scrollTo(0, 0);
      }
      
      // Update the last path
      lastPathRef.current = pathname;
    }
  }, [pathname]);

  return null;
}

const App = () => {
  // Prevent hash links from causing page jumps
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find if the click is on or inside an anchor tag
      const anchor = target.tagName === 'A' ? target : target.closest('a');
      
      if (anchor && anchor instanceof HTMLAnchorElement) {
        const href = anchor.getAttribute('href');
        
        // If it's a hash link, prevent the default behavior
        if (href && href.startsWith('#')) {
          e.preventDefault();
          
          // If needed, you can still scroll to the element manually,
          // but with the scroll position saved and restored
          const targetElement = document.getElementById(href.substring(1));
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };
    
    // Add the event listener with capture phase to intercept it early
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="symp-to-care-theme">
      <ThemeListener />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollManager />
            <Routes>
              <Route path="/test" element={<TestScreen />} />
              <Route path="/" element={<Index />} />
              <Route path="/doctors" element={<DoctorsDirectory />} />
              <Route path="/doctor/:id" element={<DoctorProfile />} />
              <Route path="/dashboard" element={<PatientDashboard />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/health-assistant" element={<HealthAssistant />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
