import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Car, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Fuel,
  Settings,
  Calendar,
  Users,
  CheckCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { Car as CarType } from "@/types";

export default function Cars() {
  const { cars, deleteCar } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || car.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || car.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const availableCars = cars.filter(car => car.status === "available").length;
  const rentedCars = cars.filter(car => car.status === "rented").length;
  const maintenanceCars = cars.filter(car => car.status === "maintenance").length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Автопарк
          </h1>
          <p className="text-black text-sm sm:text-base">Управление автомобилями</p>
        </div>
        <Link to="/cars/add">
          <Button className="bg-gradient-primary hover:bg-primary-hover w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Добавить машину
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Всего машин</p>
                <p className="text-lg sm:text-2xl font-bold">{cars.length}</p>
              </div>
              <Car className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Доступно</p>
                <p className="text-lg sm:text-2xl font-bold text-success">{availableCars}</p>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Занято</p>
                <p className="text-lg sm:text-2xl font-bold text-warning">{rentedCars}</p>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">На ремонте</p>
                <p className="text-lg sm:text-2xl font-bold text-destructive">{maintenanceCars}</p>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Поиск по названию или модели..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="economy">Эконом</SelectItem>
                <SelectItem value="business">Бизнес</SelectItem>
                <SelectItem value="premium">Премиум</SelectItem>
                <SelectItem value="suv">Внедорожник</SelectItem>
                <SelectItem value="sport">Спортивный</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="available">Доступна</SelectItem>
                <SelectItem value="rented">Занята</SelectItem>
                <SelectItem value="maintenance">На ремонте</SelectItem>
                <SelectItem value="unavailable">Недоступна</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCars.map((car) => (
          <Card key={car.id} className="shadow-card hover:shadow-elevated transition-smooth overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img 
                src={car.image} 
                alt={car.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                {getStatusBadge(car.status)}
              </div>
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                {getCategoryBadge(car.category)}
              </div>
            </div>
            
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">{car.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{car.model} {car.year}</p>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Fuel className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{car.fuelType}</span>
                    <span className="sm:hidden">{car.fuelType === 'petrol' ? 'Бенз' : car.fuelType === 'diesel' ? 'Диз' : car.fuelType === 'hybrid' ? 'Гибр' : 'Электр'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    {car.seats} мест
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base sm:text-lg font-bold text-primary">{car.pricePerDay}₼</p>
                    <p className="text-xs text-muted-foreground">за день</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm text-muted-foreground">{car.mileage.toLocaleString()} км</p>
                  </div>
                </div>

                <div className="flex gap-1 sm:gap-2 pt-2 overflow-hidden">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-w-0 h-8 sm:h-9"
                    onClick={() => navigate(`/cars/${car.id}`)}
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">Просмотр</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-w-0 h-8 sm:h-9"
                    onClick={() => navigate(`/cars/edit/${car.id}`)}
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">Изменить</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteCar(car.id)}
                    className="text-destructive hover:bg-destructive/10 flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 p-0"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Car className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Машины не найдены</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Попробуйте изменить параметры поиска или фильтры
          </p>
          <Button variant="outline" size="sm" className="sm:size-default">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Сбросить фильтры
          </Button>
        </div>
      )}


    </div>
  );
}