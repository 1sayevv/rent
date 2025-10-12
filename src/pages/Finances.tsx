import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  FileText,
  Trash2,
  Edit
} from "lucide-react";
import { useData } from "@/context/SupabaseDataContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function Finances() {
  const { bookings, monthlyExpenses, deleteMonthlyExpense } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Calculate total revenue from bookings
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  
  // Calculate total expenses
  const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate net profit
  const netProfit = totalRevenue - totalExpenses;

  const handleDeleteExpense = async (id: number) => {
    try {
      await deleteMonthlyExpense(id);
      toast({
        title: "Success",
        description: "Expense deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive"
      });
    }
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
          <TabsTrigger value="summary">Summary</TabsTrigger>
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
              {monthlyExpenses.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No expenses recorded</h3>
                  <p className="text-muted-foreground mb-4">Add your first monthly expense to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {monthlyExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{expense.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(expense.date), 'MMM dd, yyyy')}
                            {expense.isRecurring && (
                              <Badge variant="outline" className="ml-2">Recurring</Badge>
                            )}
                          </p>
                          {expense.description && (
                            <p className="text-xs text-muted-foreground mt-1">{expense.description}</p>
                          )}
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Revenue Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Bookings:</span>
                        <span className="font-medium">{bookings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Booking Value:</span>
                        <span className="font-medium">
                          {bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(2) : 0}₼
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Revenue:</span>
                        <span className="font-medium text-revenue">{totalRevenue.toFixed(2)}₼</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Expense Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Expenses:</span>
                        <span className="font-medium">{monthlyExpenses.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Expense:</span>
                        <span className="font-medium">
                          {monthlyExpenses.length > 0 ? (totalExpenses / monthlyExpenses.length).toFixed(2) : 0}₼
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Expenses:</span>
                        <span className="font-medium text-destructive">{totalExpenses.toFixed(2)}₼</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-semibold mb-2">Net Profit Analysis</h3>
                  <div className="flex justify-between items-center">
                    <span>Net Profit:</span>
                    <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {netProfit.toFixed(2)}₼
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Profit Margin:</span>
                    <span className={`font-medium ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}