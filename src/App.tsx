import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SupabaseDataProvider } from "@/context/SupabaseDataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cars from "./pages/Cars";
import AddCar from "./pages/AddCar";
import EditCar from "./pages/EditCar";
import CarDetails from "./pages/CarDetails";
import Bookings from "./pages/Bookings";
import AddBooking from "./pages/AddBooking";
import EditBooking from "./pages/EditBooking";
import Finances from "./pages/Finances";
import AddExpense from "./pages/AddExpense";
import GoogleDriveTest from "./pages/GoogleDriveTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // localStorage cleanup removed from app startup
  // Now using sessionStorage - persists until browser is closed

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public route for login */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
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
                      <Route path="/bookings/add" element={<AddBooking />} />
                      <Route path="/bookings/edit/:id" element={<EditBooking />} />
                      <Route path="/bookings/calendar" element={<Bookings />} />
                      <Route path="/finances" element={<Finances />} />
                      <Route path="/finances/add" element={<AddExpense />} />
                      <Route path="/google-drive-test" element={<GoogleDriveTest />} />
                      
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseDataProvider>
    </QueryClientProvider>
  );
};

export default App;
