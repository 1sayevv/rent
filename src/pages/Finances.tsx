import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  FileText,
  Building,
  Car,
  Phone,
  Wifi,
  Zap,
  Trash2,
  Edit,
  Eye
} from "lucide-react";
import { useData } from "@/context/SupabaseDataContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

<<<<<<< HEAD
interface MonthlyExpense {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  isRecurring: boolean;
  createdAt: string;
}

const expenseCategories = [
  { value: "office_rent", label: "Office Rent", icon: Building },
  { value: "utilities", label: "Utilities (Electricity, Water)", icon: Zap },
  { value: "internet", label: "Internet & Phone", icon: Phone },
  { value: "car_maintenance", label: "Car Maintenance", icon: Car },
  { value: "insurance", label: "Insurance", icon: FileText },
  { value: "marketing", label: "Marketing & Advertising", icon: TrendingUp },
  { value: "other", label: "Other", icon: FileText },
];

export default function Finances() {
  const { bookings } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [expenses, setExpenses] = useState<MonthlyExpense[]>([
    {
      id: 1,
      category: "office_rent",
      description: "Monthly office rent",
      amount: 800,
      date: "2024-10-01",
      isRecurring: true,
      createdAt: "2024-10-01T00:00:00Z"
    },
    {
      id: 2,
      category: "utilities",
      description: "Electricity and water bills",
      amount: 150,
      date: "2024-10-01",
      isRecurring: true,
      createdAt: "2024-10-01T00:00:00Z"
=======
export default function Finances() {
  const { hasPermission } = useAuth();
  const { financialRecords, bookings, cars, clients } = useData();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Calculate real financial metrics
  const financialMetrics = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter bookings for current month
    const currentMonthBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.startDate);
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    });

    // Calculate total revenue from bookings
    const totalRevenue = currentMonthBookings.reduce((sum, booking) => {
      return sum + (booking.totalAmount || 0);
    }, 0);

    // Calculate total expenses from financial records
    const totalExpenses = financialRecords
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + record.amount, 0);

    // Calculate net profit
    const netProfit = totalRevenue - totalExpenses;

    // Calculate debts (overdue bookings)
    const overdueBookings = bookings.filter(booking => {
      const endDate = new Date(booking.endDate);
      return endDate < currentDate && booking.status === 'active';
    });

    const totalDebts = overdueBookings.reduce((sum, booking) => {
      return sum + (booking.totalAmount || 0);
    }, 0);

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      totalDebts,
      overdueCount: overdueBookings.length
    };
  }, [bookings, financialRecords]);

  // Calculate monthly revenue data for charts
  const monthlyRevenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    
    return months.slice(0, currentDate.getMonth() + 1).map((month, index) => {
      const monthBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.startDate);
        return bookingDate.getMonth() === index && bookingDate.getFullYear() === currentDate.getFullYear();
      });

      const monthRevenue = monthBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      const monthExpenses = financialRecords
        .filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() === index && recordDate.getFullYear() === currentDate.getFullYear() && record.type === 'expense';
        })
        .reduce((sum, record) => sum + record.amount, 0);

      return {
        month,
        revenue: monthRevenue,
        expenses: monthExpenses,
        profit: monthRevenue - monthExpenses
      };
    });
  }, [bookings, financialRecords]);

  // Calculate revenue by car category
  const revenueByCategory = useMemo(() => {
    const categoryRevenue: { [key: string]: number } = {};
    
    bookings.forEach(booking => {
      const car = cars.find(c => c.id === booking.carId);
      if (car) {
        categoryRevenue[car.category] = (categoryRevenue[car.category] || 0) + (booking.totalAmount || 0);
      }
    });

    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];
    return Object.entries(categoryRevenue).map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: colors[index % colors.length]
    }));
  }, [bookings, cars]);

  // Calculate top cars by revenue
  const topCars = useMemo(() => {
    const carRevenue: { [key: string]: { revenue: number; bookings: number; car: any } } = {};
    
    bookings.forEach(booking => {
      const car = cars.find(c => c.id === booking.carId);
      if (car) {
        if (!carRevenue[car.id]) {
          carRevenue[car.id] = { revenue: 0, bookings: 0, car };
        }
        carRevenue[car.id].revenue += booking.totalAmount || 0;
        carRevenue[car.id].bookings += 1;
      }
    });

    return Object.values(carRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((item, index) => ({
        name: `${item.car.name} ${item.car.model}`,
        revenue: item.revenue,
        bookings: item.bookings,
        avgPrice: item.bookings > 0 ? Math.round(item.revenue / item.bookings) : 0
      }));
  }, [bookings, cars]);

  // Get recent payments from bookings
  const recentPayments = useMemo(() => {
    return bookings
      .filter(booking => booking.status === 'completed')
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 10)
      .map((booking, index) => {
        const car = cars.find(c => c.id === booking.carId);
        const client = clients.find(c => c.id === booking.clientId);
        
        return {
          id: booking.id,
          client: client?.name || 'Unknown Client',
          car: car ? `${car.name} ${car.model}` : 'Unknown Car',
          amount: booking.totalAmount || 0,
          date: booking.startDate,
          method: 'Card', // Default payment method
          status: 'completed'
        };
      });
  }, [bookings, cars, clients]);

  // Get overdue debts
  const debts = useMemo(() => {
    const currentDate = new Date();
    return bookings
      .filter(booking => {
        const endDate = new Date(booking.endDate);
        return endDate < currentDate && booking.status === 'active';
      })
      .map((booking, index) => {
        const car = cars.find(c => c.id === booking.carId);
        const client = clients.find(c => c.id === booking.clientId);
        const endDate = new Date(booking.endDate);
        const daysOverdue = Math.floor((currentDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          id: booking.id,
          client: client?.name || 'Unknown Client',
          car: car ? `${car.name} ${car.model}` : 'Unknown Car',
          amount: booking.totalAmount || 0,
          dueDate: booking.endDate,
          daysOverdue: Math.max(0, daysOverdue)
        };
      });
  }, [bookings, cars, clients]);

  // Prepare data for export
  const financialReport = prepareFinancialData(financialRecords, bookings, cars, clients);

  // Check permission to view finances
  if (!hasPermission('finances', 'view')) {
    return (
      <AccessDenied 
        title="Finances unavailable"
        description="Viewing financial information is only available to system administrators."
      />
    );
  }

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
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
    }
  ]);


  // Calculate total revenue from bookings
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate net profit
  const netProfit = totalRevenue - totalExpenses;

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expenseCategories.find(cat => cat.value === expense.category);
    const categoryLabel = category ? category.label : 'Other';
    
    if (!acc[categoryLabel]) {
      acc[categoryLabel] = 0;
    }
    acc[categoryLabel] += expense.amount;
    return acc;
  }, {} as Record<string, number>);


  const handleDeleteExpense = (id: number) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast({
      title: "Success",
      description: "Expense deleted successfully"
    });
  };

<<<<<<< HEAD
  const getCategoryIcon = (category: string) => {
    const categoryData = expenseCategories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : FileText;
  };

  const getCategoryLabel = (category: string) => {
    const categoryData = expenseCategories.find(cat => cat.value === category);
    return categoryData ? categoryData.label : 'Other';
  };

=======
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Finances
          </h1>
          <p className="text-muted-foreground">Financial overview and expense management</p>
        </div>
        <Button 
          className="bg-gradient-primary hover:bg-primary-hover"
          onClick={() => navigate('/finances/add')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
<<<<<<< HEAD
                <p className="text-2xl font-bold text-revenue">{totalRevenue.toLocaleString()}₼</p>
=======
                <p className="text-2xl font-bold text-revenue">{financialMetrics.totalRevenue.toLocaleString()}₼</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  From {bookings.length} bookings
                </p>
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-destructive">{totalExpenses.toLocaleString()}₼</p>
              </div>
              <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
<<<<<<< HEAD
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {netProfit.toLocaleString()}₼
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${netProfit >= 0 ? 'bg-success/20' : 'bg-destructive/20'}`}>
                <DollarSign className={`h-6 w-6 ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`} />
=======
                <p className="text-2xl font-bold text-success">{financialMetrics.netProfit.toLocaleString()}₼</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {financialMetrics.totalExpenses > 0 ? `${Math.round((financialMetrics.netProfit / financialMetrics.totalRevenue) * 100)}% margin` : 'No expenses'}
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
                <p className="text-2xl font-bold text-destructive">{financialMetrics.totalExpenses.toLocaleString()}₼</p>
                <p className="text-xs text-destructive flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  {financialRecords.filter(r => r.type === 'expense').length} records
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
                <p className="text-2xl font-bold text-warning">{financialMetrics.totalDebts.toLocaleString()}₼</p>
                <p className="text-xs text-warning flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {financialMetrics.overdueCount} overdue
                </p>
              </div>
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-warning" />
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="expenses">Monthly Expenses</TabsTrigger>
          <TabsTrigger value="categories">Expense Categories</TabsTrigger>
        </TabsList>

<<<<<<< HEAD
        <TabsContent value="expenses" className="space-y-4">
=======
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
                  <LineChart data={monthlyRevenueData}>
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
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
              {expenses.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No expenses recorded</h3>
                  <p className="text-muted-foreground mb-4">Add your first monthly expense to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map((expense) => {
                    const Icon = getCategoryIcon(expense.category);
                    return (
                      <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {getCategoryLabel(expense.category)} • {format(new Date(expense.date), 'MMM dd, yyyy')}
                              {expense.isRecurring && (
                                <Badge variant="outline" className="ml-2">Recurring</Badge>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-destructive">{expense.amount}₼</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
=======
              <div className="space-y-4">
                {topCars.length > 0 ? (
                  topCars.map((car, index) => (
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Revenue Data</h3>
                    <p className="text-muted-foreground">No bookings found to calculate revenue</p>
                  </div>
                )}
              </div>
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
            </CardContent>
          </Card>
        </TabsContent>

<<<<<<< HEAD
        <TabsContent value="categories" className="space-y-4">
=======
        <TabsContent value="revenue" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Detailed Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyRevenueData}>
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
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Expenses by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
              <div className="space-y-3">
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
=======
              <div className="space-y-4">
                {recentPayments.length > 0 ? (
                  recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.client}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.car} • {new Date(payment.date).toLocaleDateString('en-US')}
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
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
                      </div>
                      <p className="font-medium">{category}</p>
                    </div>
<<<<<<< HEAD
                    <p className="font-bold text-destructive">{amount}₼</p>
=======
                  ))
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Payments</h3>
                    <p className="text-muted-foreground">No completed bookings found</p>
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
<<<<<<< HEAD
=======

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
                {debts.length > 0 ? (
                  debts.map((debt) => (
                    <div key={debt.id} className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium">{debt.client}</p>
                          <p className="text-sm text-muted-foreground">
                            {debt.car} • Due date: {new Date(debt.dueDate).toLocaleDateString('en-US')}
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
                  ))
                ) : (
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
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
      </Tabs>
    </div>
  );
}
