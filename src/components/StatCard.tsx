import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "revenue";
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  variant = "default" 
}: StatCardProps) {
  const variantClasses = {
    default: "bg-gradient-card border",
    success: "bg-gradient-success border-success/20",
    warning: "bg-gradient-to-br from-warning-light to-warning/10 border-warning/20",
    revenue: "bg-gradient-revenue border-revenue/20"
  };

  const iconClasses = {
    default: "text-primary",
    success: "text-success-foreground",
    warning: "text-warning-foreground", 
    revenue: "text-revenue-foreground"
  };

  const changeClasses = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground"
  };

  return (
    <Card className={cn("shadow-card hover:shadow-elevated transition-smooth", variantClasses[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg", 
          variant === "default" ? "bg-primary/10" : "bg-white/20"
        )}>
          <Icon className={cn("h-4 w-4", iconClasses[variant])} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-card-foreground">{value}</div>
        {change && (
          <p className={cn("text-xs", changeClasses[changeType])}>
            {changeType === "positive" && "↗"} 
            {changeType === "negative" && "↘"} 
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}