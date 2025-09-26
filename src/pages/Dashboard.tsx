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
  AlertCircle
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
  Legend
} from "recharts";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading data...</div>
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
            <p className="text-black">Fleet and active bookings overview</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-lg font-semibold">{new Date().toLocaleDateString('en-US')}</p>
          </div>
        </div>

        {/* Stats Cards for manager */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Available Cars"
            value={dashboardStats.availableCars}
            change={`Total: ${cars.length}`}
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
            title="Active Bookings"
            value={dashboardStats.activeBookings}
            change={`Total bookings: ${bookings.length}`}
            changeType="positive"
            icon={Calendar}
            variant="default"
          />
        </div>

        {/* Today's schedule for manager */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <CheckCircle className="h-5 w-5 text-success" />
                New Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentBookings.slice(0, 4).map((booking) => (
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
        </div>
      </div>
    );
  }

  // Full version for admin
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Dashboard
          </h1>
          <p className="text-black">Your fleet overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-lg font-semibold">{new Date().toLocaleDateString('en-US')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
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
          changeType="positive"
          icon={DollarSign}
          variant="revenue"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
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
              <TrendingUp className="h-5 w-5 text-revenue" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}₼`, 'Revenue']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--revenue))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--revenue))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <CheckCircle className="h-5 w-5 text-success" />
              New Bookings
            </CardTitle>
          </CardHeader>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}