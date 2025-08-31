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
  { day: "Пн", bookings: 12 },
  { day: "Вт", bookings: 19 },
  { day: "Ср", bookings: 15 },
  { day: "Чт", bookings: 25 },
  { day: "Пт", bookings: 22 },
  { day: "Сб", bookings: 30 },
  { day: "Вс", bookings: 28 }
];

const monthlyRevenue = [
  { month: "Янв", revenue: 45000 },
  { month: "Фев", revenue: 52000 },
  { month: "Мар", revenue: 48000 },
  { month: "Апр", revenue: 61000 },
  { month: "Май", revenue: 55000 },
  { month: "Июн", revenue: 67000 }
];

const topCars = [
  { name: "Toyota Camry", bookings: 45, revenue: "28,500₼" },
  { name: "BMW X5", bookings: 38, revenue: "35,200₼" },
  { name: "Mercedes E-Class", bookings: 32, revenue: "42,800₼" },
  { name: "Hyundai Sonata", bookings: 28, revenue: "18,900₼" },
  { name: "Audi Q7", bookings: 25, revenue: "38,600₼" }
];

const recentBookings = [
  { id: 1, client: "Али Алиев", car: "BMW X5", date: "Сегодня", status: "confirmed" },
  { id: 2, client: "Лейла Мамедова", car: "Mercedes C-Class", date: "Завтра", status: "pending" },
  { id: 3, client: "Расим Гасанов", car: "Toyota Camry", date: "15.06", status: "active" },
  { id: 4, client: "Нигяр Исмайылова", car: "Hyundai Tucson", date: "16.06", status: "confirmed" },
  { id: 5, client: "Эльчин Керимов", car: "Audi Q7", date: "18.06", status: "pending" }
];

const todaySchedule = [
  { time: "09:00", action: "Выдача", client: "Али Алиев", car: "BMW X5" },
  { time: "11:30", action: "Возврат", client: "Самир Гулиев", car: "Toyota Corolla" },
  { time: "14:00", action: "Выдача", client: "Лейла Мамедова", car: "Mercedes C-Class" },
  { time: "16:30", action: "Возврат", client: "Кямал Набиев", car: "Hyundai Sonata" }
];

export default function Dashboard() {
  const { userRole } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="bg-success-light text-success border-success">Подтвержден</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-warning-light text-warning border-warning">Ожидает</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Активен</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  // Упрощенная версия для менеджера
  if (userRole === 'manager') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Dashboard
            </h1>
            <p className="text-black text-sm sm:text-base">Обзор автопарка и активных бронирований</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Сегодня</p>
            <p className="text-base sm:text-lg font-semibold">{new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Всего машин"
            value="24"
            change="+2"
            changeType="positive"
            icon={Car}
            variant="success"
          />
          <StatCard
            title="Активные брони"
            value="8"
            change="+1"
            changeType="positive"
            icon={Calendar}
            variant="default"
          />
          <StatCard
            title="Доход за месяц"
            value="45,200₼"
            change="+12%"
            changeType="positive"
            icon={DollarSign}
            variant="revenue"
          />
          <StatCard
            title="Клиенты"
            value="156"
            change="+8"
            changeType="positive"
            icon={Users}
            variant="default"
          />
        </div>

        {/* Recent Bookings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Последние бронирования</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{booking.client}</p>
                    <p className="text-sm text-muted-foreground truncate">{booking.car}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="text-xs sm:text-sm text-muted-foreground">{booking.date}</span>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Расписание на сегодня</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm sm:text-base font-medium text-primary">{item.time}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{item.action}</p>
                      <p className="text-sm text-muted-foreground truncate">{item.client} • {item.car}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Полная версия для админа
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Dashboard
          </h1>
          <p className="text-black">Обзор вашего автопарка</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Сегодня</p>
          <p className="text-lg font-semibold">{new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Свободные машины"
          value={24}
          change="+2 с вчера"
          changeType="positive"
          icon={Car}
          variant="success"
        />
        <StatCard
          title="Занятые машины"
          value={18}
          change="-3 с вчера"
          changeType="negative"
          icon={AlertCircle}
          variant="warning"
        />
        <StatCard
          title="Всего клиентов"
          value={1205}
          change="+12 за неделю"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Доход за месяц"
          value="67,500₼"
          change="+15.2% с прошлого месяца"
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
              Бронирования по дням недели
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
              Доход по месяцам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}₼`, 'Доход']} />
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
              Новые бронирования
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
              Расписание на сегодня
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
                <Badge variant={item.action === "Выдача" ? "default" : "secondary"}>
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
              ТОП-5 популярных машин
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCars.map((car, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{car.name}</p>
                  <p className="text-xs text-muted-foreground">{car.bookings} бронирований</p>
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