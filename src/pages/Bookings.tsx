import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Search,
  Check,
  X,
  Eye,
  Car,
  User,
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";

const bookings = [
  {
    id: 1,
    client: {
      name: "Али Алиев",
      phone: "+994 55 123 45 67",
      email: "ali.aliev@email.com"
    },
    car: "BMW X5 (2022)",
    startDate: "2024-06-15",
    endDate: "2024-06-20",
    pickupLocation: "Аэропорт Гейдар Алиев",
    returnLocation: "Центральный офис",
    totalPrice: 425,
    status: "confirmed",
    createdAt: "2024-06-10"
  },
  {
    id: 2,
    client: {
      name: "Лейла Мамедова",
      phone: "+994 50 987 65 43",
      email: "leyla.mamedova@email.com"
    },
    car: "Mercedes C-Class (2023)",
    startDate: "2024-06-16",
    endDate: "2024-06-18",
    pickupLocation: "Отель Four Seasons",
    returnLocation: "Отель Four Seasons",
    totalPrice: 150,
    status: "pending",
    createdAt: "2024-06-14"
  },
  {
    id: 3,
    client: {
      name: "Расим Гасанов",
      phone: "+994 77 555 33 22",
      email: "rasim.gasanov@email.com"
    },
    car: "Toyota Camry (2023)",
    startDate: "2024-06-12",
    endDate: "2024-06-16",
    pickupLocation: "Центральный офис",
    returnLocation: "Аэропорт Гейдар Алиев",
    totalPrice: 180,
    status: "active",
    createdAt: "2024-06-08"
  },
  {
    id: 4,
    client: {
      name: "Нигяр Исмайылова",
      phone: "+994 51 444 77 88",
      email: "nigar.ismayilova@email.com"
    },
    car: "Hyundai Tucson (2022)",
    startDate: "2024-06-18",
    endDate: "2024-06-25",
    pickupLocation: "Торговый центр Park Bulvar",
    returnLocation: "Центральный офис",
    totalPrice: 280,
    status: "confirmed",
    createdAt: "2024-06-13"
  },
  {
    id: 5,
    client: {
      name: "Эльчин Керимов",
      phone: "+994 70 111 22 33",
      email: "elchin.kerimov@email.com"
    },
    car: "Audi Q7 (2023)",
    startDate: "2024-06-20",
    endDate: "2024-06-27",
    pickupLocation: "Аэропорт Гейдар Алиев",
    returnLocation: "Аэропорт Гейдар Алиев",
    totalPrice: 665,
    status: "pending",
    createdAt: "2024-06-15"
  }
];

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-success-foreground">Подтвержден</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Ожидает</Badge>;
      case "active":
        return <Badge className="bg-primary text-primary-foreground">Активен</Badge>;
      case "completed":
        return <Badge className="bg-muted text-muted-foreground">Завершен</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive text-destructive-foreground">Отменен</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.car.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const activeBookings = bookings.filter(b => b.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Бронирования
          </h1>
          <p className="text-muted-foreground">Управление заказами и резервациями</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Calendar className="h-4 w-4 mr-2" />
          Календарь
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего бронирований</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Подтверждены</p>
                <p className="text-2xl font-bold text-success">{confirmedBookings}</p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ожидают</p>
                <p className="text-2xl font-bold text-warning">{pendingBookings}</p>
              </div>
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активные</p>
                <p className="text-2xl font-bold text-primary">{activeBookings}</p>
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Car className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="list">Список</TabsTrigger>
            <TabsTrigger value="calendar">Календарь</TabsTrigger>
          </TabsList>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Поиск по клиенту или машине..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="confirmed">Подтвержден</SelectItem>
                    <SelectItem value="pending">Ожидает</SelectItem>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="completed">Завершен</SelectItem>
                    <SelectItem value="cancelled">Отменен</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <TabsContent value="list" className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="shadow-card hover:shadow-elevated transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Бронирование #{booking.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Создано: {new Date(booking.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                    <div className="text-right">
                      <p className="font-bold text-xl text-revenue">{booking.totalPrice}₼</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Клиент
                    </div>
                    <div>
                      <p className="font-medium">{booking.client.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {booking.client.phone}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {booking.client.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Car className="h-4 w-4" />
                      Автомобиль
                    </div>
                    <div>
                      <p className="font-medium">{booking.car}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Даты аренды
                    </div>
                    <div>
                      <p className="font-medium">
                        {new Date(booking.startDate).toLocaleDateString('ru-RU')} - {new Date(booking.endDate).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Локации
                    </div>
                    <div>
                      <p className="text-sm">Получение: {booking.pickupLocation}</p>
                      <p className="text-sm">Возврат: {booking.returnLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Просмотр
                  </Button>
                  {booking.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-success hover:bg-success/90">
                        <Check className="h-4 w-4 mr-1" />
                        Подтвердить
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                        <X className="h-4 w-4 mr-1" />
                        Отклонить
                      </Button>
                    </>
                  )}
                  {booking.status === "active" && (
                    <Button size="sm" className="bg-warning hover:bg-warning/90">
                      <Check className="h-4 w-4 mr-1" />
                      Завершить
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Календарь бронирований
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Календарь бронирований будет реализован</p>
                  <p className="text-sm">с интеграцией с библиотекой календаря</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Бронирования не найдены</h3>
          <p className="text-muted-foreground mb-4">
            Попробуйте изменить параметры поиска или фильтры
          </p>
        </div>
      )}
    </div>
  );
}