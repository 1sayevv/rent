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
<<<<<<< HEAD
import EditBooking from "./pages/EditBooking";
=======
import Clients from "./pages/Clients";
import AddClient from "./pages/AddClient";
import EditClient from "./pages/EditClient";
import ClientDetails from "./pages/ClientDetails";
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
import Finances from "./pages/Finances";
import AddExpense from "./pages/AddExpense";
import GoogleDriveTest from "./pages/GoogleDriveTest";
import NotFound from "./pages/NotFound";
<<<<<<< HEAD
=======
// Убираем импорт useEffect
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d

const queryClient = new QueryClient();

const App = () => {
<<<<<<< HEAD
  // App başlangıcında localStorage temizleme kaldırıldı
  // Artık sessionStorage kullanıyoruz - tarayıcı kapanana kadar kalır
=======
  // Убираем принудительную очистку localStorage
  // Это было причиной проблемы с перенаправлением на логин
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d

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
<<<<<<< HEAD
                      <Route path="/bookings/edit/:id" element={<EditBooking />} />
=======
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
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
