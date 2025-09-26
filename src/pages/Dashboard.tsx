import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
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

const weeklyBookings = [
  { day: "Mon", bookings: 12 },
  { day: "Tue", bookings: 19 },
  { day: "Wed", bookings: 15 },
  { day: "Thu", bookings: 25 },
  { day: "Fri", bookings: 22 },
  { day: "Sat", bookings: 30 },
  { day: "Sun", bookings: 28 }
];

const monthlyRevenue = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 }
];

const topCars = [
  { name: "Toyota Camry", bookings: 45, revenue: "28,500₼" },
  { name: "BMW X5", bookings: 38, revenue: "35,200₼" },
  { name: "Mercedes E-Class", bookings: 32, revenue: "42,800₼" },
  { name: "Hyundai Sonata", bookings: 28, revenue: "18,900₼" },
  { name: "Audi Q7", bookings: 25, revenue: "38,600₼" }
];

const recentBookings = [
  { id: 1, client: "Ali Aliyev", car: "BMW X5", date: "Today", status: "confirmed" },
  { id: 2, client: "Leyla Mamedova", car: "Mercedes C-Class", date: "Tomorrow", status: "pending" },
  { id: 3, client: "Rasim Gasanov", car: "Toyota Camry", date: "15.06", status: "active" },
  { id: 4, client: "Nigyar Ismayilova", car: "Hyundai Tucson", date: "16.06", status: "confirmed" },
  { id: 5, client: "Elchin Kerimov", car: "Audi Q7", date: "18.06", status: "pending" }
];

const todaySchedule = [
  { time: "09:00", action: "Pickup", client: "Ali Aliyev", car: "BMW X5" },
  { time: "11:30", action: "Return", client: "Samir Guliyev", car: "Toyota Corolla" },
  { time: "14:00", action: "Pickup", client: "Leyla Mamedova", car: "Mercedes C-Class" },
  { time: "16:30", action: "Return", client: "Kyamal Nabiyev", car: "Hyundai Sonata" }
];

export default function Dashboard() {
  const { userRole } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="bg-success-light text-success border-success">Confirmed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-warning-light text-warning border-warning">Pending</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Active</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Simplified version for manager
  if (userRole === 'manager') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Dashboard
            </h1>
            <p className="text-black">Overview of the fleet and active bookings</p>
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
            value={24}
            change="+2 from yesterday"
            changeType="positive"
            icon={Car}
            variant="success"
          />
          <StatCard
            title="Occupied Cars"
            value={18}
            change="-3 from yesterday"
            changeType="negative"
            icon={AlertCircle}
            variant="warning"
          />
          <StatCard
            title="Active Bookings"
            value={12}
            change="+3 today"
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
              {todaySchedule.map((item, index) => (
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
              ))}
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
          <p className="text-black">Overview of your fleet</p>
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
          value={24}
          change="+2 from yesterday"
          changeType="positive"
          icon={Car}
          variant="success"
        />
        <StatCard
          title="Occupied Cars"
          value={18}
          change="-3 from yesterday"
          changeType="negative"
          icon={AlertCircle}
          variant="warning"
        />
        <StatCard
          title="Total Clients"
          value={1205}
          change="+12 this week"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value="67,500₼"
          change="+15.2% from last month"
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
              <BarChart data={weeklyBookings}>
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
              <LineChart data={monthlyRevenue}>
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
            {todaySchedule.map((item, index) => (
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
            ))}
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
            {topCars.map((car, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{car.name}</p>
                  <p className="text-xs text-muted-foreground">{car.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-revenue">{car.revenue}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}