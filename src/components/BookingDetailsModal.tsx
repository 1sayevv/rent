import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Car,
  User,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Booking, Car as CarType, Client } from '@/types';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: number) => void;
  onStatusChange: (bookingId: number, status: string) => void;
  car?: CarType;
  client?: Client;
}

export function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  car,
  client
}: BookingDetailsModalProps) {
  if (!booking) return null;

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

  const getStatusActions = () => {
    switch (booking.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-success hover:bg-success/90"
              onClick={() => onStatusChange(booking.id, 'confirmed')}
            >
              <Check className="h-4 w-4 mr-1" />
              Подтвердить
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:bg-destructive/10"
              onClick={() => onStatusChange(booking.id, 'cancelled')}
            >
              <X className="h-4 w-4 mr-1" />
              Отклонить
            </Button>
          </div>
        );
      case "confirmed":
        return (
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => onStatusChange(booking.id, 'active')}
          >
            <Car className="h-4 w-4 mr-1" />
            Начать аренду
          </Button>
        );
      case "active":
        return (
          <Button 
            size="sm" 
            className="bg-success hover:bg-success/90"
            onClick={() => onStatusChange(booking.id, 'completed')}
          >
            <Check className="h-4 w-4 mr-1" />
            Завершить
          </Button>
        );
      default:
        return null;
    }
  };

  const calculateDuration = () => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = () => {
    const endDate = new Date(booking.endDate);
    const now = new Date();
    return booking.status === 'active' && endDate < now;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Детали бронирования #{booking.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Статус и действия */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusBadge(booking.status)}
                  {isOverdue() && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Просрочено
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {getStatusActions()}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(booking)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Изменить
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm('Вы уверены, что хотите удалить это бронирование?')) {
                        onDelete(booking.id);
                        onClose();
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Удалить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Основная информация */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Информация о машине */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Информация о машине
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{booking.car}</h3>
                  {car && (
                    <div className="space-y-2 mt-2">
                      <p className="text-sm text-muted-foreground">
                        Категория: {car.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Топливо: {car.fuelType}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Трансмиссия: {car.transmission}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Пробег: {car.mileage.toLocaleString()} км
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Информация о клиенте */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Информация о клиенте
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{booking.client.name}</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.client.email}</span>
                    </div>
                    {client && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Клиент с {format(new Date(client.joinDate), 'dd.MM.yyyy', { locale: ru })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Детали бронирования */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Детали бронирования
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Период аренды</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.startDate), 'dd MMMM yyyy', { locale: ru })} - {format(new Date(booking.endDate), 'dd MMMM yyyy', { locale: ru })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Продолжительность: {calculateDuration()} дней
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Локации</p>
                      <p className="text-sm text-muted-foreground">
                        Получение: {booking.pickupLocation}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Возврат: {booking.returnLocation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Стоимость</p>
                      <p className="text-2xl font-bold text-revenue">{booking.totalPrice}₼</p>
                      <p className="text-xs text-muted-foreground">
                        {car && `${car.pricePerDay}₼ за день × ${calculateDuration()} дней`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Дата создания</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.createdAt), 'dd MMMM yyyy в HH:mm', { locale: ru })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* История изменений */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                История изменений
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Бронирование создано</span>
                  <span className="text-muted-foreground">
                    {format(new Date(booking.createdAt), 'dd.MM.yyyy HH:mm', { locale: ru })}
                  </span>
                </div>
                {booking.updatedAt !== booking.createdAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span>Бронирование обновлено</span>
                    <span className="text-muted-foreground">
                      {format(new Date(booking.updatedAt), 'dd.MM.yyyy HH:mm', { locale: ru })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 