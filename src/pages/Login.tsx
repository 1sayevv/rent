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
  Mail
} from "lucide-react";

const USER_CREDENTIALS = {
  superadmin: {
    email: "superadmin",
    password: "super123",
    name: "Super Administrator"
  },
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

  // Use sessionStorage - persists until browser is closed
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  const userData = sessionStorage.getItem('userData');

  // If user is already authenticated and has user data, redirect to home
  if (isAuthenticated && userData) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials for all roles
    let userRole: UserRole | null = null;
    let userName = "";

    if (email === USER_CREDENTIALS.superadmin.email && password === USER_CREDENTIALS.superadmin.password) {
      userRole = 'admin';
      userName = USER_CREDENTIALS.superadmin.name;
    } else if (email === USER_CREDENTIALS.admin.email && password === USER_CREDENTIALS.admin.password) {
      userRole = 'admin';
      userName = USER_CREDENTIALS.admin.name;
    } else if (email === USER_CREDENTIALS.manager.email && password === USER_CREDENTIALS.manager.password) {
      userRole = 'manager';
      userName = USER_CREDENTIALS.manager.name;
    }

    if (userRole) {
      // Save user data
      const userData = {
        id: Date.now(),
        email,
        role: userRole,
        name: userName,
        createdAt: new Date().toISOString()
      };

      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userData', JSON.stringify(userData));
      sessionStorage.setItem('loginTime', new Date().toISOString());

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
        {/* Logo and title */}
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

        {/* Login form */}
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
                  Username or Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your username or email"
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
          </CardContent>
        </Card>

        {/* Additional information */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © 2024 Auto Manage Suite. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
} 