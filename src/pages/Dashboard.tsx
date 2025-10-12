import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/context/SupabaseDataContext";
import { useMemo } from "react";
import { 
  Car, 
  Users, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  Wallet,
  TrendingDown,
  Minus
} from "lucide-react";
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
import { financialApi, DashboardStats, CarPerformance, PeriodRevenue } from "@/lib/api/financial";
import { bookingsApi } from "@/lib/api/bookings";
import { useEffect, useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay, endOfDay } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PeriodType = 'today' | 'week' | 'month' | 'year' | 'all';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { userRole } = useAuth();
  const { monthlyExpenses, cars } = useData();
  const [period, setPeriod] = useState<PeriodType>('month');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [carPerformance, setCarPerformance] = useState<CarPerformance[]>([]);
  const [revenueData, setRevenueData] = useState<PeriodRevenue[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getDateRange = (periodType: PeriodType): [string, string] => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (periodType) {
      case 'today':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'week':
        start = subDays(now, 7);
        end = now;
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      case 'all':
        start = new Date('2020-01-01');
        end = now;
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
    }

    return [format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd')];
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [startDate, endDate] = getDateRange(period);

      console.log('Dashboard: Loading data for period:', period, 'from', startDate, 'to', endDate);

      // Load stats
      const dashboardStats = await financialApi.getDashboardStats(startDate, endDate);
      console.log('Dashboard: Stats loaded:', dashboardStats);
      setStats(dashboardStats);

      // Load car performance
      const carPerf = await financialApi.getCarPerformance(startDate, endDate);
      console.log('Dashboard: Car performance loaded:', carPerf);
      setCarPerformance(carPerf);

      // Load revenue data
      if (period === 'year') {
        const yearData = await financialApi.getMonthlyRevenue(new Date().getFullYear());
        console.log('Dashboard: Yearly revenue loaded:', yearData);
        setRevenueData(yearData);
      } else {
        const dailyData = await financialApi.getDailyRevenue(startDate, endDate);
        console.log('Dashboard: Daily revenue loaded:', dailyData);
        setRevenueData(dailyData);
      }

      // Load recent bookings
      const allBookings = await bookingsApi.getAll();
      console.log('Dashboard: Recent bookings loaded:', allBookings.length);
      setRecentBookings(allBookings.slice(0, 5));

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  // Calculate expenses based on period
  const getFilteredExpenses = () => {
    const [startDate, endDate] = getDateRange(period);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return monthlyExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = (stats?.myIncome || 0) - totalExpenses;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Confirmed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Active</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Simplified version for manager
  if (userRole === 'manager') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Dashboard
            </h1>
            <p className="text-black">Fleet and booking overview</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-lg font-semibold">{format(new Date(), 'dd.MM.yyyy')}</p>
          </div>
        </div>

        {/* Stats Cards for manager */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Bookings"
            value={stats?.activeBookings || 0}
            change={`${stats?.totalBookings || 0} total bookings`}
            changeType="positive"
            icon={Calendar}
            variant="info"
          />
          <StatCard
            title="My Income"
            value={`${(stats?.myIncome || 0).toFixed(2)}₼`}
            change={`Avg: ${(stats?.averageBookingValue || 0).toFixed(2)}₼`}
            changeType="positive"
            icon={Wallet}
            variant="success"
          />
          <StatCard
            title="Total Expenses"
            value={`${totalExpenses.toFixed(2)}₼`}
            change={`${filteredExpenses.length} expenses`}
            changeType="negative"
            icon={TrendingDown}
            variant="destructive"
          />
          <StatCard
            title="Net Profit"
            value={`${netProfit.toFixed(2)}₼`}
            change={netProfit >= 0 ? "Positive" : "Negative"}
            changeType={netProfit >= 0 ? "positive" : "negative"}
            icon={netProfit >= 0 ? TrendingUp : Minus}
            variant={netProfit >= 0 ? "success" : "destructive"}
          />
        </div>

        {/* Recent bookings and expenses for manager */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <CheckCircle className="h-5 w-5 text-success" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentBookings.slice(0, 4).map((booking) => {
                const car = cars.find(c => c.id === booking.carId);
                const carName = car ? `${car.brand} ${car.model}` : 'Unknown Car';
                return (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{booking.customerName}</p>
                      <p className="text-xs text-muted-foreground">{carName} • {format(new Date(booking.startDate), 'dd.MM.yyyy')}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <TrendingDown className="h-5 w-5 text-destructive" />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredExpenses.slice(0, 4).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">{expense.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(expense.date), 'dd.MM.yyyy')}
                      {expense.isRecurring && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">Recurring</span>
                      )}
                    </p>
                  </div>
                  <p className="font-bold text-destructive">{expense.amount}₼</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Car className="h-5 w-5 text-primary" />
                Top Performing Cars
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {carPerformance.slice(0, 4).map((car) => (
                <div key={car.carId} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">{car.carName}</p>
                    <p className="text-xs text-muted-foreground">{car.totalDays} days • {car.bookingCount} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-revenue">{car.totalRevenue.toFixed(2)}₼</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Full version for admin
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Financial Dashboard
          </h1>
          <p className="text-black">Detailed revenue and car performance analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-lg font-semibold">{format(new Date(), 'dd.MM.yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Revenue"
          value={`${(stats?.totalRevenue || 0).toFixed(2)}₼`}
          change={`${stats?.totalBookings || 0} bookings`}
          changeType="positive"
          icon={DollarSign}
          variant="revenue"
        />
        <StatCard
          title="My Income"
          value={`${(stats?.myIncome || 0).toFixed(2)}₼`}
          change={`%${stats?.totalRevenue ? ((stats.myIncome / stats.totalRevenue) * 100).toFixed(1) : 0}`}
          changeType="positive"
          icon={Wallet}
          variant="success"
        />
        <StatCard
          title="Total Expenses"
          value={`${totalExpenses.toFixed(2)}₼`}
          change={`${filteredExpenses.length} expenses`}
          changeType="negative"
          icon={TrendingDown}
          variant="destructive"
        />
        <StatCard
          title="Net Profit"
          value={`${netProfit.toFixed(2)}₼`}
          change={netProfit >= 0 ? "Positive" : "Negative"}
          changeType={netProfit >= 0 ? "positive" : "negative"}
          icon={netProfit >= 0 ? TrendingUp : Minus}
          variant={netProfit >= 0 ? "success" : "destructive"}
        />
        <StatCard
          title="Owner Income"
          value={`${(stats?.ownerIncome || 0).toFixed(2)}₼`}
          change={`%${stats?.totalRevenue ? ((stats.ownerIncome / stats.totalRevenue) * 100).toFixed(1) : 0}`}
          changeType="positive"
          icon={Users}
          variant="info"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <TrendingUp className="h-5 w-5 text-revenue" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="period" 
                  tickFormatter={(value) => {
                    if (period === 'year') {
                      return value.substring(5); // MM format
                    }
                    return value.substring(5); // MM-DD format
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(2)}₼`}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Total Revenue"
                  dot={{ fill: "#10b981", strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="myIncome" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="My Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="ownerIncome" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Owner Income"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <DollarSign className="h-5 w-5 text-primary" />
              Revenue Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'My Income', value: stats?.myIncome || 0 },
                    { name: 'Owner Income', value: stats?.ownerIncome || 0 },
                    { name: 'Expenses', value: totalExpenses }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: %${(percent * 100).toFixed(0)}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1, 2].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}₼`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Car Performance Details */}
      <Card className="shadow-card">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Car className="h-5 w-5 text-primary" />
              Car Performance Details
            </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="space-y-4 mt-4">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Car</th>
                        <th className="px-4 py-3 text-center font-semibold">Bookings</th>
                        <th className="px-4 py-3 text-center font-semibold">Total Days</th>
                        <th className="px-4 py-3 text-right font-semibold">Total Revenue</th>
                        <th className="px-4 py-3 text-right font-semibold">My Income</th>
                        <th className="px-4 py-3 text-right font-semibold">Owner Income</th>
                        <th className="px-4 py-3 text-right font-semibold">Avg Daily</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {carPerformance.map((car) => (
                        <tr key={car.carId} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{car.carName}</td>
                          <td className="px-4 py-3 text-center">{car.bookingCount}</td>
                          <td className="px-4 py-3 text-center">{car.totalDays}</td>
                          <td className="px-4 py-3 text-right font-semibold text-revenue">
                            {car.totalRevenue.toFixed(2)}₼
                          </td>
                          <td className="px-4 py-3 text-right text-success">
                            {car.myIncome.toFixed(2)}₼
                          </td>
                          <td className="px-4 py-3 text-right text-warning">
                            {car.ownerIncome.toFixed(2)}₼
                          </td>
                          <td className="px-4 py-3 text-right">
                            {car.averageDailyRate.toFixed(2)}₼
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="chart" className="mt-4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={carPerformance.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="carName" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)}₼`} />
                  <Legend />
                  <Bar dataKey="totalRevenue" fill="#10b981" name="Total Revenue" />
                  <Bar dataKey="myIncome" fill="#3b82f6" name="My Income" />
                  <Bar dataKey="ownerIncome" fill="#f59e0b" name="Owner Income" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <CheckCircle className="h-5 w-5 text-success" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentBookings.map((booking) => {
            const car = cars.find(c => c.id === booking.carId);
            const carName = car ? `${car.brand} ${car.model}` : 'Unknown Car';
            return (
              <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <p className="font-medium text-sm">{booking.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {carName} • {format(new Date(booking.startDate), 'dd.MM.yyyy')} - {format(new Date(booking.endDate), 'dd.MM.yyyy')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total: {booking.totalAmount.toFixed(2)}₼ • Mine: {booking.myIncome.toFixed(2)}₼ • Owner: {booking.ownerAmount.toFixed(2)}₼
                  </p>
                </div>
                {getStatusBadge(booking.status)}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}