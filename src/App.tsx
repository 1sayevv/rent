import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { DataProvider } from "@/context/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cars from "./pages/Cars";
import AddCar from "./pages/AddCar";
import EditCar from "./pages/EditCar";
import CarDetails from "./pages/CarDetails";
import Bookings from "./pages/Bookings";
import Clients from "./pages/Clients";
import AddClient from "./pages/AddClient";
import EditClient from "./pages/EditClient";
import ClientDetails from "./pages/ClientDetails";
import Finances from "./pages/Finances";
import Settings from "./pages/Settings";
import DataManager from "./components/DataManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
                <BrowserRouter>
          <Routes>
            {/* Публичный маршрут для входа */}
            <Route path="/login" element={<Login />} />
            
            {/* Защищенные маршруты */}
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/cars" element={<Cars />} />
                    <Route path="/cars/add" element={<AddCar />} />
                    <Route path="/cars/edit/:id" element={<EditCar />} />
                    <Route path="/cars/:id" element={<CarDetails />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/bookings/calendar" element={<Bookings />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/clients/add" element={<AddClient />} />
                    <Route path="/clients/edit/:id" element={<EditClient />} />
                    <Route path="/clients/:id" element={<ClientDetails />} />
                    <Route path="/finances" element={<Finances />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/data" element={<DataManager />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
