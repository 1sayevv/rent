import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Car, 
  Fuel, 
  Settings, 
  Calendar, 
  MapPin, 
  DollarSign,
  Users,
  Clock,
  Star,
  FileText,
  Tag,
  Hash,
  ArrowLeft,
  Edit,
  User
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { Car as CarType } from "@/types";

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cars } = useData();

  // Проверяем, что ID является числом
  const carId = Number(id);
  const car = isNaN(carId) ? null : cars.find(c => c.id === carId);

  if (!car) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/cars')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к машинам
          </Button>
        </div>
        <div className="text-center py-12">
          <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Машина не найдена</h3>
          <p className="text-muted-foreground">
            Запрашиваемая машина не существует или была удалена
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-success text-success-foreground">Доступна</Badge>;
      case "rented":
        return <Badge className="bg-warning text-warning-foreground">Занята</Badge>;
      case "maintenance":
        return <Badge className="bg-destructive text-destructive-foreground">Ремонт</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Эконом":
        return <Badge variant="outline" className="text-muted-foreground">Эконом</Badge>;
      case "Бизнес":
        return <Badge variant="outline" className="text-primary border-primary">Бизнес</Badge>;
      case "Премиум":
        return <Badge variant="outline" className="text-revenue border-revenue">Премиум</Badge>;
      case "Джип":
        return <Badge variant="outline" className="text-success border-success">Джип</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и навигация */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/cars')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к машинам
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-black">
              Детали автомобиля
            </h1>
            <p className="text-muted-foreground">Подробная информация о машине</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/cars/edit/${car.id}`)}
          className="bg-gradient-primary hover:bg-primary-hover"
        >
          <Edit className="h-4 w-4 mr-2" />
          Редактировать
        </Button>
      </div>

      <div className="space-y-6">
        {/* Основная информация */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Изображение */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(car.status)}
                  {getCategoryBadge(car.category)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Информация о машине */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">{car.name}</h2>
                  <p className="text-lg text-muted-foreground">{car.model}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Год выпуска: {car.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Категория: {car.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Тип топлива: {car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Коробка передач: {car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Количество сидений: {car.seats}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Пробег: {car.mileage.toLocaleString()} км</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Добавлена: {new Date(car.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Обновлена: {new Date(car.updatedAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Цены */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-revenue" />
                Тарифы
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-medium text-black">За день</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{car.pricePerDay}₼</p>
                </div>
                {car.weeklyPrice && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium text-black">За неделю</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{car.weeklyPrice}₼</p>
                  </div>
                )}
                {car.monthlyPrice && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium text-black">За месяц</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{car.monthlyPrice}₼</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Описание */}
        {car.description && (
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Описание
                </h3>
                <div className="p-4 border rounded-lg bg-muted/30">
                  <p className="text-black leading-relaxed">{car.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Дополнительные изображения */}
        {car.images && car.images.length > 0 && (
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-black">Дополнительные фото</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {car.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${car.name} - фото ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Техническая информация */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Техническая информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="h-4 w-4 text-primary" />
                    <span className="font-medium text-black">ID автомобиля</span>
                  </div>
                  <p className="text-lg font-bold text-primary">#{car.id}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium text-black">Статус</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(car.status)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                Статистика
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-success" />
                    <span className="font-medium text-black">Бронирования</span>
                  </div>
                  <p className="text-2xl font-bold text-success">0</p>
                  <p className="text-sm text-muted-foreground">всего</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-warning" />
                    <span className="font-medium text-black">Рейтинг</span>
                  </div>
                  <p className="text-2xl font-bold text-warning">4.8</p>
                  <p className="text-sm text-muted-foreground">из 5</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium text-black">Доход</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">0₼</p>
                  <p className="text-sm text-muted-foreground">за все время</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 