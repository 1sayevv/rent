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
  Calendar
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { CarDetailsModal } from "@/components/CarDetailsModal";
import { Car as CarType } from "@/types";

export default function Cars() {
  const { cars, deleteCar } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewCar = (car: CarType) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Автопарк
          </h1>
          <p className="text-black">Управление автомобилями</p>
        </div>
        <Link to="/cars/add">
          <Button className="bg-gradient-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Добавить машину
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего машин</p>
                <p className="text-2xl font-bold">{cars.length}</p>
              </div>
              <Car className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Доступные</p>
                <p className="text-2xl font-bold text-success">{availableCars}</p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <Car className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">В аренде</p>
                <p className="text-2xl font-bold text-warning">{rentedCars}</p>
              </div>
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">На ремонте</p>
                <p className="text-2xl font-bold text-destructive">{maintenanceCars}</p>
              </div>
              <div className="w-8 h-8 bg-destructive/20 rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Поиск по марке или модели..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="Эконом">Эконом</SelectItem>
                <SelectItem value="Бизнес">Бизнес</SelectItem>
                <SelectItem value="Премиум">Премиум</SelectItem>
                <SelectItem value="Джип">Джип</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="available">Доступна</SelectItem>
                <SelectItem value="rented">Занята</SelectItem>
                <SelectItem value="maintenance">Ремонт</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <Card key={car.id} className="shadow-card hover:shadow-elevated transition-smooth overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img 
                src={car.image} 
                alt={car.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                {getStatusBadge(car.status)}
              </div>
              <div className="absolute top-3 left-3">
                {getCategoryBadge(car.category)}
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{car.name}</h3>
                  <p className="text-sm text-muted-foreground">{car.model} год</p>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Fuel className="h-4 w-4" />
                    {car.fuelType}
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    {car.transmission}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-primary">{car.pricePerDay}₼</p>
                    <p className="text-xs text-muted-foreground">за день</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{car.mileage.toLocaleString()} км</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 overflow-hidden">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-w-0"
                    onClick={() => handleViewCar(car)}
                  >
                    <Eye className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">Просмотр</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-w-0"
                    onClick={() => navigate(`/cars/edit/${car.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">Изменить</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteCar(car.id)}
                    className="text-destructive hover:bg-destructive/10 flex-shrink-0 w-9 h-9 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Машины не найдены</h3>
          <p className="text-muted-foreground mb-4">
            Попробуйте изменить параметры поиска или фильтры
          </p>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Сбросить фильтры
          </Button>
        </div>
      )}

      {/* Модальное окно с деталями машины */}
      <CarDetailsModal
        car={selectedCar}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}