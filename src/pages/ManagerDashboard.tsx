import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Users, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

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

export default function ManagerDashboard() {
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

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Dashboard
          </h1>
          <p className="text-black text-sm sm:text-base">Управление автопарком</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-muted-foreground">Сегодня</p>
          <p className="text-lg font-semibold">{new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Bookings */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-black text-lg">
              <CheckCircle className="h-5 w-5 text-success" />
              Активные бронирования
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <p className="font-medium text-sm">{booking.client}</p>
                  <p className="text-xs text-muted-foreground">{booking.car} • {booking.date}</p>
                </div>
                <div className="self-start sm:self-center">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-black text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Расписание на сегодня
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaySchedule.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="text-left sm:text-center min-w-[60px]">
                  <p className="text-xs font-medium text-primary">{item.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.client} • {item.car}</p>
                </div>
                <div className="self-start sm:self-center">
                  <Badge variant={item.action === "Выдача" ? "default" : "secondary"}>
                    {item.action}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}