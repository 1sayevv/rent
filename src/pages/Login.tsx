import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { 
  Car, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail,
  Shield,
  User
} from "lucide-react";

const USER_CREDENTIALS = {
  admin: {
    email: "admin@mail.com",
    password: "1234",
    name: "Administrator"
  },
  manager: {
    email: "manager@mail.com", 
    password: "1234",
    name: "Manager"
  }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Простая проверка аутентификации через localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userData = localStorage.getItem('userData');

  // Если пользователь уже авторизован и есть данные пользователя, перенаправляем на главную
  if (isAuthenticated && userData) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Имитация задержки для лучшего UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Проверяем учетные данные для обеих ролей
    let userRole: UserRole | null = null;
    let userName = "";

    if (email === USER_CREDENTIALS.admin.email && password === USER_CREDENTIALS.admin.password) {
      userRole = 'admin';
      userName = USER_CREDENTIALS.admin.name;
    } else if (email === USER_CREDENTIALS.manager.email && password === USER_CREDENTIALS.manager.password) {
      userRole = 'manager';
      userName = USER_CREDENTIALS.manager.name;
    }

    if (userRole) {
      // Сохраняем данные пользователя
      const userData = {
        id: Date.now(),
        email,
        role: userRole,
        name: userName,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('loginTime', new Date().toISOString());

      const roleText = userRole === 'admin' ? 'administrator' : 'manager';

      toast({
        title: "Login successful",
        description: `Welcome to the car rental management system, ${roleText}!`
      });

      navigate("/");
    } else {
      toast({
        title: "Login error",
        description: "Invalid email or password",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Auto Manage Suite
          </h1>
          <p className="text-muted-foreground">
            Car Rental Management System
          </p>
        </div>

        {/* Форма входа */}
        <Card className="shadow-2xl border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              Sign In
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Enter your credentials to access the system
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@mail.com or manager@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:bg-primary-hover"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Информация о тестовых аккаунтах */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Тестовые аккаунты:
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-primary" />
                  <span className="font-medium">Администратор:</span>
                  <span className="text-muted-foreground">admin@mail.com / 1234</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-primary" />
                  <span className="font-medium">Менеджер:</span>
                  <span className="text-muted-foreground">manager@mail.com / 1234</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Дополнительная информация */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © 2024 Auto Manage Suite. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
} 