import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { AccessDenied } from "@/components/AccessDenied";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Car,
  Download,
  Eye,
  AlertTriangle
} from "lucide-react";
import { ExportModal } from "@/components/ExportModal";
import { prepareFinancialData } from "@/utils/exportUtils";
import { useData } from "@/context/SupabaseDataContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 45000, expenses: 12000, profit: 33000 },
  { month: "Feb", revenue: 52000, expenses: 15000, profit: 37000 },
  { month: "Mar", revenue: 48000, expenses: 13000, profit: 35000 },
  { month: "Apr", revenue: 61000, expenses: 18000, profit: 43000 },
  { month: "May", revenue: 55000, expenses: 16000, profit: 39000 },
  { month: "Jun", revenue: 67000, expenses: 19000, profit: 48000 }
];

const topCars = [
  { name: "BMW X5", revenue: 35200, bookings: 38, avgPrice: 95 },
  { name: "Mercedes C-Class", revenue: 42800, bookings: 32, avgPrice: 75 },
  { name: "Toyota Camry", revenue: 28500, bookings: 45, avgPrice: 45 },
  { name: "Audi Q7", revenue: 38600, bookings: 25, avgPrice: 120 },
  { name: "Hyundai Sonata", revenue: 18900, bookings: 28, avgPrice: 35 }
];

const revenueByCategory = [
  { name: "Economy", value: 28500, color: "#10b981" },
  { name: "Business", value: 45200, color: "#3b82f6" },
  { name: "Premium", value: 67800, color: "#f59e0b" },
  { name: "SUV", value: 38600, color: "#8b5cf6" }
];

const recentPayments = [
  {
    id: 1,
    client: "Ali Aliyev",
    car: "BMW X5",
    amount: 425,
    date: "2024-06-15",
    method: "Card",
    status: "completed"
  },
  {
    id: 2,
    client: "Leyla Mamedova", 
    car: "Mercedes C-Class",
    amount: 150,
    date: "2024-06-14",
    method: "Cash",
    status: "completed"
  },
  {
    id: 3,
    client: "Rasim Gasanov",
    car: "Toyota Camry",
    amount: 180,
    date: "2024-06-13",
    method: "Bank Transfer",
    status: "pending"
  },
  {
    id: 4,
    client: "Nigyar Ismayilova",
    car: "Hyundai Tucson", 
    amount: 280,
    date: "2024-06-12",
    method: "Card",
    status: "completed"
  }
];

const debts = [
  {
    id: 1,
    client: "Kyamal Nabiyev",
    car: "Audi A6",
    amount: 320,
    dueDate: "2024-06-10",
    daysOverdue: 5
  },
  {
    id: 2,
    client: "Samir Guliyev",
    car: "BMW X3",
    amount: 180,
    dueDate: "2024-06-08",
    daysOverdue: 7
  }
];

export default function Finances() {
  const { hasPermission } = useAuth();
  const { financialRecords, bookings, cars, clients } = useData();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Check permission to view finances
  if (!hasPermission('finances', 'view')) {
    return (
      <AccessDenied 
        title="Finances unavailable"
        description="Viewing financial information is only available to system administrators."
      />
    );
  }

  // Prepare data for export
  const financialReport = prepareFinancialData(financialRecords, bookings, cars, clients);

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Paid</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "failed":
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
  const totalProfit = monthlyRevenue.reduce((sum, month) => sum + month.profit, 0);
  const totalExpenses = monthlyRevenue.reduce((sum, month) => sum + month.expenses, 0);
  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-revenue bg-clip-text text-transparent">
            Finances
          </h1>
          <p className="text-muted-foreground">Income and expense analysis</p>
        </div>
        <Button 
          className="bg-gradient-primary hover:bg-primary-hover"
          onClick={() => setIsExportModalOpen(true)}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-revenue">{totalRevenue.toLocaleString()}₼</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% from last month
                </p>
              </div>
              <div className="w-8 h-8 bg-revenue/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-revenue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold text-success">{totalProfit.toLocaleString()}₼</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.2% from last month
                </p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold text-destructive">{totalExpenses.toLocaleString()}₼</p>
                <p className="text-xs text-destructive flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5.1% from last month
                </p>
              </div>
              <div className="w-8 h-8 bg-destructive/20 rounded-full flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Debts</p>
                <p className="text-2xl font-bold text-warning">{totalDebts}₼</p>
                <p className="text-xs text-warning flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {debts.length} overdue
                </p>
              </div>
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-fit grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="debts">Debts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-revenue" />
                  Monthly Revenue and Profit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}₼`, '']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--revenue))" 
                      strokeWidth={3}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={3}
                      name="Profit"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Category */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Revenue by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}₼`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Cars */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Top 5 Cars by Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCars.map((car, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{car.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {car.bookings} bookings • {car.avgPrice}₼ per day
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-revenue">{car.revenue.toLocaleString()}₼</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Detailed Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}₼`, '']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="hsl(var(--revenue))" name="Revenue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-revenue" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.client}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.car} • {new Date(payment.date).toLocaleDateString('ru-RU')}
                        </p>
                        <p className="text-xs text-muted-foreground">{payment.method}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-revenue">{payment.amount}₼</p>
                        {getPaymentStatusBadge(payment.status)}
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debts" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Overdue Debts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">{debt.client}</p>
                        <p className="text-sm text-muted-foreground">
                          {debt.car} • Due date: {new Date(debt.dueDate).toLocaleDateString('ru-RU')}
                        </p>
                        <Badge className="bg-destructive text-destructive-foreground mt-1">
                          Overdue by {debt.daysOverdue} days
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-destructive">{debt.amount}₼</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-success hover:bg-success/90">
                          Paid
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {debts.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Debts</h3>
                    <p className="text-muted-foreground">All payments are made on time!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        report={financialReport}
      />
    </div>
  );
}