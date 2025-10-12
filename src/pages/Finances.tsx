import { useState } from "react";
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

  const getCategoryIcon = (category: string) => {
    const categoryData = expenseCategories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : FileText;
  };

  const getCategoryLabel = (category: string) => {
    const categoryData = expenseCategories.find(cat => cat.value === category);
    return categoryData ? categoryData.label : 'Other';
  };

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
                <p className="text-2xl font-bold text-revenue">{totalRevenue.toLocaleString()}₼</p>
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
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {netProfit.toLocaleString()}₼
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${netProfit >= 0 ? 'bg-success/20' : 'bg-destructive/20'}`}>
                <DollarSign className={`h-6 w-6 ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`} />
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

        <TabsContent value="expenses" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Expenses by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-medium">{category}</p>
                    </div>
                    <p className="font-bold text-destructive">{amount}₼</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
