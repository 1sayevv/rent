import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar as CalendarIcon,
  Car,
  User,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, isSameDay, isWithinInterval, startOfDay, endOfDay, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Booking, Car as CarType } from '@/types';

interface BookingCalendarProps {
  bookings: Booking[];
  cars: CarType[];
  onViewBooking: (booking: Booking) => void;
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (bookingId: number) => void;
  onAddBooking: () => void;
}

export function BookingCalendar({
  bookings,
  cars,
  onViewBooking,
  onEditBooking,
  onDeleteBooking,
  onAddBooking
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [carFilter, setCarFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  // Фильтрация бронирований
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesCar = carFilter === 'all' || booking.car === carFilter;
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesCar && matchesStatus;
    });
  }, [bookings, carFilter, statusFilter]);

  // Получение дней месяца
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Получение бронирований для конкретного дня
  const getBookingsForDay = (date: Date) => {
    return filteredBookings.filter(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return isWithinInterval(date, {
        start: startOfDay(bookingStart),
        end: endOfDay(bookingEnd)
      });
    });
  };

  // Получение цвета для статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'active':
        return 'bg-primary text-primary-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Обработчик клика по дню
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDayModalOpen(true);
  };

  // Навигация по месяцам
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  // Получение дней недели для отображения пустых ячеек
  const getCalendarDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const startDay = start.getDay();
    
    const days = [];
    
    // Добавляем пустые ячейки в начале (воскресенье = 0, понедельник = 1)
    const daysToAdd = startDay === 0 ? 6 : startDay - 1;
    for (let i = 0; i < daysToAdd; i++) {
      days.push(null);
    }
    
    // Добавляем дни месяца
    eachDayOfInterval({ start, end }).forEach(day => {
      days.push(day);
    });
    
    // Добавляем пустые ячейки в конце до полной сетки 6 недель
    const remainingDays = 42 - days.length; // 6 недель * 7 дней = 42
    for (let i = 0; i < remainingDays; i++) {
      days.push(null);
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Фильтры:</span>
            </div>
            
            <Select value={carFilter} onValueChange={setCarFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Все машины" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все машины</SelectItem>
                {cars.map(car => (
                  <SelectItem key={car.id} value={car.name}>
                    {car.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Все статусы" />
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

            <Button onClick={onAddBooking} className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Добавить бронирование
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Календарь */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Календарь бронирований
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold">
                {format(currentMonth, 'MMMM yyyy', { locale: ru })}
              </span>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Заголовки дней недели */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Дни календаря */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-24 border border-border rounded-lg bg-muted/20" />;
              }

              const dayBookings = getBookingsForDay(date);
              const isToday = isSameDay(date, new Date());
              const isSelected = selectedDate && isSameDay(date, selectedDate);

              return (
                <div 
                  key={index}
                  className={`h-24 border border-border rounded-lg p-1 cursor-pointer hover:bg-accent/50 transition-colors ${
                    isToday ? 'bg-accent ring-2 ring-primary' : ''
                  } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleDayClick(date)}
                >
                  <div className="text-sm font-medium mb-1">
                    {format(date, 'd')}
                  </div>
                  
                  {dayBookings.length > 0 && (
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${getStatusColor(booking.status)}`}
                          title={`${booking.client.name} - ${booking.car}`}
                        >
                          {booking.client.name}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-muted-foreground px-1">
                          +{dayBookings.length - 2} еще
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Легенда */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Легенда</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-success text-success-foreground">Подтвержден</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-warning text-warning-foreground">Ожидает</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">Активен</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-muted text-muted-foreground">Завершен</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-destructive text-destructive-foreground">Отменен</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Модальное окно с бронированиями дня */}
      <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Бронирования на {selectedDate && format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedDate && getBookingsForDay(selectedDate).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>На этот день нет бронирований</p>
              </div>
            ) : (
              selectedDate && getBookingsForDay(selectedDate).map(booking => (
                <Card key={booking.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{booking.car}</h4>
                          <p className="text-sm text-muted-foreground">{booking.client.name}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status === 'confirmed' && 'Подтвержден'}
                        {booking.status === 'pending' && 'Ожидает'}
                        {booking.status === 'active' && 'Активен'}
                        {booking.status === 'completed' && 'Завершен'}
                        {booking.status === 'cancelled' && 'Отменен'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(booking.startDate), 'dd.MM.yyyy')} - {format(new Date(booking.endDate), 'dd.MM.yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.totalPrice}₼</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.pickupLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.client.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          onViewBooking(booking);
                          setIsDayModalOpen(false);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Просмотр
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          onEditBooking(booking);
                          setIsDayModalOpen(false);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Изменить
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          onDeleteBooking(booking.id);
                          setIsDayModalOpen(false);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 