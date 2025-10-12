import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "revenue" | "destructive" | "info";
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
    default: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50",
    success: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200/50",
    warning: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/50",
    revenue: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50",
    destructive: "bg-gradient-to-br from-red-50 to-red-100 border-red-200/50",
    info: "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200/50"
  };

  const iconClasses = {
    default: "text-blue-600",
    success: "text-emerald-600",
    warning: "text-amber-600", 
    revenue: "text-purple-600",
    destructive: "text-red-600",
    info: "text-cyan-600"
  };

  const changeClasses = {
    positive: "text-emerald-600",
    negative: "text-red-600",
    neutral: "text-gray-600"
  };

  const iconBgClasses = {
    default: "bg-blue-500/10",
    success: "bg-emerald-500/10",
    warning: "bg-amber-500/10",
    revenue: "bg-purple-500/10",
    destructive: "bg-red-500/10",
    info: "bg-cyan-500/10"
  };

  return (
    <Card className={cn(
      "shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden relative",
      variantClasses[variant]
    )}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-xs sm:text-sm font-semibold text-gray-700">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2.5 rounded-xl shadow-sm",
          iconBgClasses[variant]
        )}>
          <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", iconClasses[variant])} />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</div>
        {change && (
          <p className={cn("text-xs font-medium flex items-center gap-1", changeClasses[changeType])}>
            {changeType === "positive" && "↗"} 
            {changeType === "negative" && "↘"} 
            {changeType === "neutral" && "→"}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}