import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccessDeniedProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export function AccessDenied({ 
  title = "Доступ ограничен", 
  description = "Эта функция доступна только администраторам системы.",
  showBackButton = true 
}: AccessDeniedProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {description}
          </p>
          
          {showBackButton && (
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-primary hover:bg-primary-hover"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться на главную
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 