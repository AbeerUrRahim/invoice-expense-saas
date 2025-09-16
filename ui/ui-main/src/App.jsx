import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Expenses from "./pages/Expenses";
import AddInvoiceForm from "./pages/AddInvoiceForm";
import AddExpenseForm from "./pages/AddExpenseForm";
import UpdateExpenseForm from "./pages/UpdateExpenseForm";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import UpdateInvoiceForm from "./pages/UpdateInvoiceForm";

import { isTokenExpired } from "./pages/Service/JwtToken";
import { toast } from "sonner";

const queryClient = new QueryClient();

function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (location.pathname !== "/login" && location.pathname !== "/register") {
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    }
  }, [navigate, location]);

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthWrapper>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<Dashboard />} />
              </Route>
              <Route path="/invoices" element={<Layout />}>
                <Route index element={<Invoices />} />
                <Route path="new" element={<AddInvoiceForm />} />
                <Route path="edit/:id" element={<UpdateInvoiceForm />} />
              </Route>
              <Route path="/expenses" element={<Layout />}>
                <Route index element={<Expenses />} />
                <Route path="new" element={<AddExpenseForm />} />
                <Route path="edit/:id" element={<UpdateExpenseForm />} />
              </Route>
              
              <Route path="/profile" element={<Layout />}>
                <Route index element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
