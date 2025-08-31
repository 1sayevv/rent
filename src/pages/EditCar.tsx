import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Upload,
  X,
  Car,
  Save,
  ArrowLeft,
  ImagePlus
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { DraggableImageGallery } from "@/components/DraggableImageGallery";

export default function EditCar() {
  const { id } = useParams();
  const { cars, updateCar } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    year: "",
    category: "",
    fuelType: "",
    transmission: "",
    seats: "",
    dailyPrice: "",
    weeklyPrice: "",
    monthlyPrice: "",
    mileage: "",
    status: "available",
    description: ""
  });

  // Находим машину по ID
  const car = cars.find(c => c.id === Number(id));

  // Загружаем данные машины при загрузке компонента
  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name,
        model: car.model,
        year: car.year,
        category: car.category,
        fuelType: car.fuelType,
        transmission: car.transmission,
        seats: car.seats.toString(),
        dailyPrice: car.pricePerDay.toString(),
        weeklyPrice: car.weeklyPrice?.toString() || "",
        monthlyPrice: car.monthlyPrice?.toString() || "",
        mileage: car.mileage.toString(),
        status: car.status,
        description: car.description || ""
      });
      
      // Загружаем изображения
      if (car.images && car.images.length > 0) {
        setImages(car.images);
      } else if (car.image) {
        setImages([car.image]);
      }
    }
  }, [car]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateCar = () => {
    if (!formData.name || !formData.model || !formData.category || !formData.dailyPrice) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    if (!car) {
      toast({
        title: "Ошибка",
        description: "Машина не найдена",
        variant: "destructive"
      });
      return;
    }

    const updatedCarData = {
      ...car,
      name: formData.name,
      model: formData.model,
      year: formData.year,
      category: formData.category,
      pricePerDay: parseFloat(formData.dailyPrice),
      weeklyPrice: formData.weeklyPrice ? parseFloat(formData.weeklyPrice) : undefined,
      monthlyPrice: formData.monthlyPrice ? parseFloat(formData.monthlyPrice) : undefined,
      mileage: parseInt(formData.mileage) || 0,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      seats: parseInt(formData.seats) || 5,
      status: formData.status as 'available' | 'rented' | 'maintenance' | 'unavailable',
      description: formData.description,
      image: images[0] || "/placeholder.svg",
      images: images.length > 0 ? images : undefined,
      updatedAt: new Date().toISOString()
    };

    updateCar(car.id, updatedCarData);
    
    toast({
      title: "Успешно",
      description: "Информация об автомобиле обновлена"
    });

    navigate("/cars");
  };

  // Если машина не найдена, показываем сообщение
  if (!car) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/cars">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-black">Редактировать машину</h1>
            <p className="text-black">Машина не найдена</p>
          </div>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Машина не найдена</h3>
            <p className="text-muted-foreground mb-4">
              Запрашиваемая машина не существует или была удалена
            </p>
            <Link to="/cars">
              <Button>Вернуться к списку машин</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/cars">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-black">
            Редактировать машину
          </h1>
          <p className="text-black">Обновите информацию об автомобиле</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Основная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название машины</Label>
                  <Input 
                    id="name"
                    placeholder="Toyota"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Модель</Label>
                  <Input 
                    id="model"
                    placeholder="Camry"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Год выпуска</Label>
                  <Input 
                    id="year"
                    type="number"
                    placeholder="2023"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mileage">Пробег (км)</Label>
                  <Input 
                    id="mileage"
                    type="number"
                    placeholder="15000"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange("mileage", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Категория</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Эконом">Эконом</SelectItem>
                      <SelectItem value="Бизнес">Бизнес</SelectItem>
                      <SelectItem value="Премиум">Премиум</SelectItem>
                      <SelectItem value="Джип">Джип</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Тип топлива</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Тип топлива" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Бензин">Бензин</SelectItem>
                      <SelectItem value="Дизель">Дизель</SelectItem>
                      <SelectItem value="Гибрид">Гибрид</SelectItem>
                      <SelectItem value="Электрическая">Электрическая</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>КПП</Label>
                  <Select value={formData.transmission} onValueChange={(value) => handleInputChange("transmission", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="КПП" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Автомат">Автомат</SelectItem>
                      <SelectItem value="Механика">Механика</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="seats">Количество сидений</Label>
                  <Input 
                    id="seats"
                    type="number"
                    min="2"
                    max="9"
                    placeholder="5"
                    value={formData.seats}
                    onChange={(e) => handleInputChange("seats", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-revenue">Ценообразование</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dailyPrice">Цена за день (₼)</Label>
                  <Input 
                    id="dailyPrice"
                    type="number"
                    placeholder="45"
                    value={formData.dailyPrice}
                    onChange={(e) => handleInputChange("dailyPrice", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="weeklyPrice">Цена за неделю (₼)</Label>
                  <Input 
                    id="weeklyPrice"
                    type="number"
                    placeholder="280"
                    value={formData.weeklyPrice}
                    onChange={(e) => handleInputChange("weeklyPrice", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyPrice">Цена за месяц (₼)</Label>
                  <Input 
                    id="monthlyPrice"
                    type="number"
                    placeholder="1100"
                    value={formData.monthlyPrice}
                    onChange={(e) => handleInputChange("monthlyPrice", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Дополнительная информация о автомобиле..."
                className="min-h-[100px]"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Images Upload */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-primary" />
                Фотографии
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-smooth">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Нажмите для загрузки фотографий
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG до 10MB
                  </p>
                </label>
              </div>

              {images.length > 0 && (
                <DraggableImageGallery
                  images={images}
                  onImagesChange={handleImagesChange}
                  onRemoveImage={removeImage}
                />
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Статус</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Доступна</SelectItem>
                  <SelectItem value="rented">Занята</SelectItem>
                  <SelectItem value="maintenance">На ремонте</SelectItem>
                  <SelectItem value="unavailable">Недоступна</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Документы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Загрузить страховку
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Загрузить техпаспорт
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="shadow-card">
            <CardContent className="pt-6 space-y-3">
              <Button 
                className="w-full bg-gradient-primary hover:bg-primary-hover"
                onClick={handleUpdateCar}
              >
                <Save className="h-4 w-4 mr-2" />
                Обновить машину
              </Button>
              <Button variant="outline" className="w-full">
                Сохранить как черновик
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 