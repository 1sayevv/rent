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

<<<<<<< HEAD
type PeriodType = 'today' | 'week' | 'month' | 'year' | 'all';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { userRole } = useAuth();
  const [period, setPeriod] = useState<PeriodType>('month');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [carPerformance, setCarPerformance] = useState<CarPerformance[]>([]);
  const [revenueData, setRevenueData] = useState<PeriodRevenue[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock expenses data - in real app this would come from API
  const [expenses] = useState([
    {
      id: 1,
      name: "Office Rent",
      amount: 800,
      date: "2024-10-01",
      isRecurring: true
    },
    {
      id: 2,
      name: "Utilities",
      amount: 150,
      date: "2024-10-01",
      isRecurring: true
    },
    {
      id: 3,
      name: "Internet & Phone",
      amount: 100,
      date: "2024-10-05",
      isRecurring: true
    },
    {
      id: 4,
      name: "Car Maintenance",
      amount: 300,
      date: "2024-10-10",
      isRecurring: false
    }
  ]);

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

      // Load stats
      const dashboardStats = await financialApi.getDashboardStats(startDate, endDate);
      setStats(dashboardStats);

      // Load car performance
      const carPerf = await financialApi.getCarPerformance(startDate, endDate);
      setCarPerformance(carPerf);

      // Load revenue data
      if (period === 'year') {
        const yearData = await financialApi.getMonthlyRevenue(new Date().getFullYear());
        setRevenueData(yearData);
      } else {
        const dailyData = await financialApi.getDailyRevenue(startDate, endDate);
        setRevenueData(dailyData);
      }

      // Load recent bookings
      const allBookings = await bookingsApi.getAll();
      setRecentBookings(allBookings.slice(0, 5));

    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
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

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = (stats?.myIncome || 0) - totalExpenses;
=======
export default function Dashboard() {
  const { userRole } = useAuth();
  const { cars, clients, bookings, financialRecords, isLoading } = useData();

  // Calculate statistics based on real data
  const dashboardStats = useMemo(() => {
    const availableCars = cars.filter(car => car.status === 'available').length;
    const occupiedCars = cars.filter(car => car.status === 'rented').length;
    const totalClients = clients.length;
    
    // Calculate active bookings
    const activeBookings = bookings.filter(booking => 
      booking.status === 'confirmed' || booking.status === 'active'
    ).length;

    // Calculate monthly revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = bookings
      .filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.getMonth() === currentMonth && 
               bookingDate.getFullYear() === currentYear &&
               booking.status !== 'cancelled';
      })
      .reduce((total, booking) => total + booking.totalPrice, 0);

    return {
      availableCars,
      occupiedCars,
      totalClients,
      activeBookings,
      monthlyRevenue
    };
  }, [cars, clients, bookings]);

  // Calculate chart data
  const chartData = useMemo(() => {
    // Group bookings by day of week
    const weeklyBookings = Array.from({ length: 7 }, (_, index) => {
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const bookingsCount = bookings.filter(booking => {
        const bookingDate = new Date(booking.startDate);
        return bookingDate.getDay() === (index + 1) % 7; // Monday = 0
      }).length;
      
      return {
        day: dayNames[index],
        bookings: bookingsCount
      };
    });

    // Calculate revenue by months (last 6 months)
    const monthlyRevenue = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      
      const revenue = bookings
        .filter(booking => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear() &&
                 booking.status !== 'cancelled';
        })
        .reduce((total, booking) => total + booking.totalPrice, 0);

      return {
        month,
        revenue: revenue
      };
    });

    return { weeklyBookings, monthlyRevenue };
  }, [bookings]);

  // Top cars by number of bookings
  const topCars = useMemo(() => {
    const carBookings = cars.map(car => {
      const carBookingCount = bookings.filter(booking => 
        booking.carId === car.id && booking.status !== 'cancelled'
      ).length;
      
      const carRevenue = bookings
        .filter(booking => booking.carId === car.id && booking.status !== 'cancelled')
        .reduce((total, booking) => total + booking.totalPrice, 0);

      return {
        name: car.name,
        bookings: carBookingCount,
        revenue: `${carRevenue.toLocaleString()}₼`
      };
    })
    .filter(car => car.bookings > 0)
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

    return carBookings;
  }, [cars, bookings]);

  // Recent bookings
  const recentBookings = useMemo(() => {
    return bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(booking => {
        const client = clients.find(c => c.id === booking.clientId);
        const car = cars.find(c => c.id === booking.carId);
        const bookingDate = new Date(booking.startDate);
        const isToday = bookingDate.toDateString() === new Date().toDateString();
        const isTomorrow = bookingDate.toDateString() === new Date(Date.now() + 24*60*60*1000).toDateString();
        
        let dateText = bookingDate.toLocaleDateString('en-US');
        if (isToday) dateText = 'Today';
        else if (isTomorrow) dateText = 'Tomorrow';
        
        return {
          id: booking.id,
          client: client?.name || 'Unknown Client',
          car: car?.name || 'Unknown Car',
          date: dateText,
          status: booking.status
        };
      });
  }, [bookings, clients, cars]);

  // Today's schedule
  const todaySchedule = useMemo(() => {
    const today = new Date().toDateString();
    const todayBookings = bookings.filter(booking => {
      const startDate = new Date(booking.startDate).toDateString();
      const endDate = new Date(booking.endDate).toDateString();
      return startDate === today || endDate === today;
    });

    return todayBookings.map(booking => {
      const client = clients.find(c => c.id === booking.clientId);
      const car = cars.find(c => c.id === booking.carId);
      const isPickup = new Date(booking.startDate).toDateString() === today;
      
      return {
        time: isPickup ? "09:00" : "17:00", // Approximate time
        action: isPickup ? "Pickup" : "Return",
        client: client?.name || 'Unknown Client',
        car: car?.name || 'Unknown Car'
      };
    }).slice(0, 4);
  }, [bookings, clients, cars]);
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d

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

<<<<<<< HEAD
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Yükleniyor...</div>
=======
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading data...</div>
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
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
<<<<<<< HEAD
            <p className="text-black">Filo ve rezervasyonlara genel bakış</p>
=======
            <p className="text-black">Fleet and active bookings overview</p>
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Bugün</p>
            <p className="text-lg font-semibold">{format(new Date(), 'dd.MM.yyyy')}</p>
          </div>
        </div>

        {/* Stats Cards for manager */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
<<<<<<< HEAD
            title="Aktif Rezervasyonlar"
            value={stats?.activeBookings || 0}
            change={`${stats?.totalBookings || 0} toplam rezervasyon`}
=======
            title="Available Cars"
            value={dashboardStats.availableCars}
            change={`Total: ${cars.length}`}
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
            changeType="positive"
            icon={Calendar}
            variant="info"
          />
          <StatCard
            title="Benim Kazancım"
            value={`${(stats?.myIncome || 0).toFixed(2)}₼`}
            change={`Ort: ${(stats?.averageBookingValue || 0).toFixed(2)}₼`}
            changeType="positive"
            icon={Wallet}
            variant="success"
          />
          <StatCard
<<<<<<< HEAD
            title="Toplam Harcama"
            value={`${totalExpenses.toFixed(2)}₼`}
            change={`${filteredExpenses.length} masraf`}
            changeType="negative"
            icon={TrendingDown}
            variant="destructive"
          />
          <StatCard
            title="Net Kar"
            value={`${netProfit.toFixed(2)}₼`}
            change={netProfit >= 0 ? "Pozitif" : "Negatif"}
            changeType={netProfit >= 0 ? "positive" : "negative"}
            icon={netProfit >= 0 ? TrendingUp : Minus}
            variant={netProfit >= 0 ? "success" : "destructive"}
=======
            title="Rented Cars"
            value={dashboardStats.occupiedCars}
            change={`${Math.round((dashboardStats.occupiedCars / cars.length) * 100)}% occupancy`}
            changeType={dashboardStats.occupiedCars > cars.length * 0.7 ? "negative" : "positive"}
            icon={AlertCircle}
            variant="warning"
          />
          <StatCard
            title="Active Bookings"
            value={dashboardStats.activeBookings}
            change={`Total bookings: ${bookings.length}`}
            changeType="positive"
            icon={Calendar}
            variant="default"
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
          />
        </div>

        {/* Recent bookings and expenses for manager */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <CheckCircle className="h-5 w-5 text-success" />
                Son Rezervasyonlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
<<<<<<< HEAD
              {recentBookings.slice(0, 4).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">{booking.customerName}</p>
                    <p className="text-xs text-muted-foreground">{booking.carName} • {format(new Date(booking.startDate), 'dd.MM.yyyy')}</p>
=======
              {todaySchedule.length > 0 ? todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs font-medium text-primary">{item.time}</p>
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No events today</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <TrendingDown className="h-5 w-5 text-destructive" />
                Aylık Harcamalar
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
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">Tekrarlanan</span>
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
                En İyi Performans Gösteren Araçlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {carPerformance.slice(0, 4).map((car) => (
                <div key={car.carId} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">{car.carName}</p>
                    <p className="text-xs text-muted-foreground">{car.totalDays} gün • {car.bookingCount} rezervasyon</p>
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
            Finansal Dashboard
          </h1>
<<<<<<< HEAD
          <p className="text-black">Detaylı gelir ve araç performans analizi</p>
=======
          <p className="text-black">Your fleet overview</p>
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Periyot seç" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Bugün</SelectItem>
              <SelectItem value="week">Son 7 Gün</SelectItem>
              <SelectItem value="month">Bu Ay</SelectItem>
              <SelectItem value="year">Bu Yıl</SelectItem>
              <SelectItem value="all">Tüm Zamanlar</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Bugün</p>
            <p className="text-lg font-semibold">{format(new Date(), 'dd.MM.yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
<<<<<<< HEAD
          title="Toplam Gelir"
          value={`${(stats?.totalRevenue || 0).toFixed(2)}₼`}
          change={`${stats?.totalBookings || 0} rezervasyon`}
=======
          title="Available Cars"
          value={dashboardStats.availableCars}
          change={`Total cars: ${cars.length}`}
          changeType="positive"
          icon={Car}
          variant="success"
        />
        <StatCard
          title="Rented Cars"
          value={dashboardStats.occupiedCars}
          change={`${Math.round((dashboardStats.occupiedCars / cars.length) * 100)}% occupancy`}
          changeType={dashboardStats.occupiedCars > cars.length * 0.7 ? "negative" : "positive"}
          icon={AlertCircle}
          variant="warning"
        />
        <StatCard
          title="Total Clients"
          value={dashboardStats.totalClients}
          change={`VIP clients: ${clients.filter(c => c.status === 'vip').length}`}
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value={`${dashboardStats.monthlyRevenue.toLocaleString()}₼`}
          change={`Active bookings: ${dashboardStats.activeBookings}`}
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
          changeType="positive"
          icon={DollarSign}
          variant="revenue"
        />
        <StatCard
          title="Benim Kazancım"
          value={`${(stats?.myIncome || 0).toFixed(2)}₼`}
          change={`%${stats?.totalRevenue ? ((stats.myIncome / stats.totalRevenue) * 100).toFixed(1) : 0}`}
          changeType="positive"
          icon={Wallet}
          variant="success"
        />
        <StatCard
          title="Toplam Harcama"
          value={`${totalExpenses.toFixed(2)}₼`}
          change={`${filteredExpenses.length} masraf`}
          changeType="negative"
          icon={TrendingDown}
          variant="destructive"
        />
        <StatCard
          title="Net Kar"
          value={`${netProfit.toFixed(2)}₼`}
          change={netProfit >= 0 ? "Pozitif" : "Negatif"}
          changeType={netProfit >= 0 ? "positive" : "negative"}
          icon={netProfit >= 0 ? TrendingUp : Minus}
          variant={netProfit >= 0 ? "success" : "destructive"}
        />
        <StatCard
          title="Sahip Kazancı"
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
<<<<<<< HEAD
=======
              <Calendar className="h-5 w-5 text-primary" />
              Bookings by Day of Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.weeklyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
              <TrendingUp className="h-5 w-5 text-revenue" />
              Gelir Trendi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
<<<<<<< HEAD
              <LineChart data={revenueData}>
=======
              <LineChart data={chartData.monthlyRevenue}>
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
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
                  labelFormatter={(label) => `Tarih: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Toplam Gelir"
                  dot={{ fill: "#10b981", strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="myIncome" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Benim Kazancım"
                />
                <Line 
                  type="monotone" 
                  dataKey="ownerIncome" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Sahip Kazancı"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <DollarSign className="h-5 w-5 text-primary" />
              Gelir Dağılımı
            </CardTitle>
          </CardHeader>
<<<<<<< HEAD
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Benim Kazancım', value: stats?.myIncome || 0 },
                    { name: 'Sahip Kazancı', value: stats?.ownerIncome || 0 },
                    { name: 'Harcamalar', value: totalExpenses }
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
=======
          <CardContent className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{booking.client}</p>
                  <p className="text-xs text-muted-foreground">{booking.car} • {booking.date}</p>
                </div>
                {getStatusBadge(booking.status)}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Clock className="h-5 w-5 text-primary" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySchedule.length > 0 ? todaySchedule.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="text-center min-w-[60px]">
                  <p className="text-xs font-medium text-primary">{item.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.client} • {item.car}</p>
                </div>
                <Badge variant={item.action === "Pickup" ? "default" : "secondary"}>
                  {item.action}
                </Badge>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No events today</p>
            )}
          </CardContent>
        </Card>

        {/* Top Cars */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Car className="h-5 w-5 text-primary" />
              TOP-5 Popular Cars
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCars.length > 0 ? topCars.map((car, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{car.name}</p>
                  <p className="text-xs text-muted-foreground">{car.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-revenue">{car.revenue}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No booking data</p>
            )}
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
          </CardContent>
        </Card>
      </div>

      {/* Car Performance Details */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Car className="h-5 w-5 text-primary" />
            Araç Performans Detayları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Tablo Görünümü</TabsTrigger>
              <TabsTrigger value="chart">Grafik Görünümü</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="space-y-4 mt-4">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Araç</th>
                        <th className="px-4 py-3 text-center font-semibold">Rezervasyon</th>
                        <th className="px-4 py-3 text-center font-semibold">Toplam Gün</th>
                        <th className="px-4 py-3 text-right font-semibold">Toplam Gelir</th>
                        <th className="px-4 py-3 text-right font-semibold">Benim Kazancım</th>
                        <th className="px-4 py-3 text-right font-semibold">Sahip Kazancı</th>
                        <th className="px-4 py-3 text-right font-semibold">Ort. Günlük</th>
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
                  <Bar dataKey="totalRevenue" fill="#10b981" name="Toplam Gelir" />
                  <Bar dataKey="myIncome" fill="#3b82f6" name="Benim Kazancım" />
                  <Bar dataKey="ownerIncome" fill="#f59e0b" name="Sahip Kazancı" />
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
            Son Rezervasyonlar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-medium text-sm">{booking.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {booking.carName} • {format(new Date(booking.startDate), 'dd.MM.yyyy')} - {format(new Date(booking.endDate), 'dd.MM.yyyy')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Toplam: {booking.totalAmount.toFixed(2)}₼ • Benim: {booking.myIncome.toFixed(2)}₼ • Sahip: {booking.ownerAmount.toFixed(2)}₼
                </p>
              </div>
              {getStatusBadge(booking.status)}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}