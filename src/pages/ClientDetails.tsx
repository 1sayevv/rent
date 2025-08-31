import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  Car,
  DollarSign,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  Activity,
  Edit,
  Trash2,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useData } from '@/context/DataContext';
import { Client, Booking, Car as CarType } from '@/types';

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, bookings, cars, deleteClient } = useData();

  // Проверяем, что ID является числом
  const clientId = Number(id);
  const client = isNaN(clientId) ? null : clients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к клиентам
          </Button>
        </div>
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Клиент не найден</h3>
          <p className="text-muted-foreground">
            Запрашиваемый клиент не существует или был удален
          </p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "vip":
        return <Badge className="bg-revenue text-revenue-foreground">VIP</Badge>;
      case "regular":
        return <Badge className="bg-primary text-primary-foreground">Постоянный</Badge>;
      case "new":
        return <Badge className="bg-success text-success-foreground">Новый</Badge>;
      default:
        return <Badge variant="outline">Обычный</Badge>;
    }
  };

  // Получение бронирований клиента
  const clientBookings = bookings.filter(booking => booking.clientId === client.id);

  // Статистика клиента
  const totalBookings = clientBookings.length;
  const totalSpent = clientBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const averageBookingValue = totalBookings > 0 ? totalSpent / totalBookings : 0;
  const lastBooking = clientBookings.length > 0 
    ? clientBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  // Любимые машины клиента
  const favoriteCars = clientBookings.reduce((acc, booking) => {
    acc[booking.car] = (acc[booking.car] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topFavoriteCar = Object.entries(favoriteCars)
    .sort(([,a], [,b]) => b - a)[0];

  // Статусы бронирований
  const bookingStatuses = clientBookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Активность по месяцам
  const monthlyActivity = clientBookings.reduce((acc, booking) => {
    const month = format(new Date(booking.createdAt), 'yyyy-MM');
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentActivity = Object.entries(monthlyActivity)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6);

  const handleDeleteClient = (clientId: number) => {
    if (confirm('Вы уверены, что хотите удалить этого клиента?')) {
      deleteClient(clientId);
      navigate('/clients');
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и навигация */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к клиентам
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-black">
              Детали клиента
            </h1>
            <p className="text-muted-foreground">Подробная информация о клиенте</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/clients/edit/${client.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Изменить
          </Button>
          <Button 
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => handleDeleteClient(client.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Удалить
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Основная информация */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{client.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(client.status)}
                    <span className="text-sm text-muted-foreground">
                      ID: {client.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Телефон</p>
                    <p className="text-sm text-muted-foreground">{client.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Дата регистрации</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(client.joinDate), 'dd MMMM yyyy', { locale: ru })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Всего бронирований</p>
                    <p className="text-2xl font-bold text-primary">{totalBookings}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Общая сумма</p>
                    <p className="text-2xl font-bold text-revenue">{totalSpent.toLocaleString()}₼</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Средний чек</p>
                    <p className="text-lg font-semibold text-primary">
                      {averageBookingValue.toLocaleString()}₼
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Детальная информация */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Бронирования</TabsTrigger>
            <TabsTrigger value="statistics">Статистика</TabsTrigger>
            <TabsTrigger value="activity">Активность</TabsTrigger>
            <TabsTrigger value="preferences">Предпочтения</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  История бронирований
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientBookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>У клиента пока нет бронирований</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clientBookings
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 10)
                      .map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Car className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{booking.car}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(booking.startDate), 'dd.MM.yyyy')} - {format(new Date(booking.endDate), 'dd.MM.yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{booking.totalPrice}₼</p>
                            <Badge className={booking.status === 'completed' ? 'bg-success' : 
                                             booking.status === 'active' ? 'bg-primary' : 
                                             booking.status === 'cancelled' ? 'bg-destructive' : 'bg-warning'}>
                              {booking.status === 'completed' ? 'Завершен' :
                               booking.status === 'active' ? 'Активен' :
                               booking.status === 'cancelled' ? 'Отменен' :
                               booking.status === 'confirmed' ? 'Подтвержден' : 'Ожидает'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Статусы бронирований
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(bookingStatuses).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm capitalize">
                          {status === 'completed' ? 'Завершенные' :
                           status === 'active' ? 'Активные' :
                           status === 'cancelled' ? 'Отмененные' :
                           status === 'confirmed' ? 'Подтвержденные' : 'Ожидающие'}
                        </span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Любимые машины
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(favoriteCars)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([car, count]) => (
                        <div key={car} className="flex items-center justify-between">
                          <span className="text-sm">{car}</span>
                          <Badge variant="outline">{count} раз</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Активность по месяцам
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map(([month, count]) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-sm">
                        {format(new Date(month + '-01'), 'MMMM yyyy', { locale: ru })}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...Object.values(monthlyActivity))) * 100}%` }}
                          />
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Предпочтения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Любимая машина</p>
                      <p className="text-lg font-semibold text-primary">
                        {topFavoriteCar ? topFavoriteCar[0] : 'Нет данных'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Средняя продолжительность аренды</p>
                      <p className="text-lg font-semibold text-primary">
                        {clientBookings.length > 0 
                          ? Math.round(clientBookings.reduce((sum, booking) => {
                              const start = new Date(booking.startDate);
                              const end = new Date(booking.endDate);
                              return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                            }, 0) / clientBookings.length)
                          : 0} дней
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Последнее бронирование</p>
                      <p className="text-sm text-muted-foreground">
                        {lastBooking 
                          ? format(new Date(lastBooking.createdAt), 'dd MMMM yyyy', { locale: ru })
                          : 'Нет данных'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Показатели
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Частота бронирований</p>
                      <p className="text-lg font-semibold text-primary">
                        {clientBookings.length > 0 
                          ? Math.round((clientBookings.length / 
                              ((new Date().getTime() - new Date(client.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30))) * 10) / 10
                          : 0} в месяц
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Процент завершенных</p>
                      <p className="text-lg font-semibold text-success">
                        {clientBookings.length > 0 
                          ? Math.round((bookingStatuses.completed || 0) / clientBookings.length * 100)
                          : 0}%
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Процент отмененных</p>
                      <p className="text-lg font-semibold text-destructive">
                        {clientBookings.length > 0 
                          ? Math.round((bookingStatuses.cancelled || 0) / clientBookings.length * 100)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 