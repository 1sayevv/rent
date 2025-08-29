import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  Save,
  ArrowLeft,
  Upload,
  Trash2
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { Client } from "@/types";

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, updateClient } = useData();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "new" as "vip" | "regular" | "new",
    avatar: "",
    totalBookings: 0,
    totalSpent: 0,
    joinDate: "",
    lastBooking: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Загрузка данных клиента
  useEffect(() => {
    if (id) {
      const client = clients.find(c => c.id === parseInt(id));
      if (client) {
        setFormData({
          name: client.name,
          email: client.email,
          phone: client.phone,
          status: client.status,
          avatar: client.avatar,
          totalBookings: client.totalBookings,
          totalSpent: client.totalSpent,
          joinDate: client.joinDate,
          lastBooking: client.lastBooking
        });
      } else {
        navigate("/clients");
      }
    }
  }, [id, clients, navigate]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно для заполнения";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен для заполнения";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обязателен для заполнения";
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (id) {
        updateClient(parseInt(id), formData);
        navigate("/clients");
      }
    } catch (error) {
      console.error("Ошибка при обновлении клиента:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatar: ""
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/clients")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Редактирование клиента
            </h1>
            <p className="text-muted-foreground">Обновите информацию о клиенте</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Основная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Аватар */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar} alt={formData.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>
                {formData.avatar && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={removeAvatar}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {formData.avatar ? "Изменить фото" : "Загрузить фото"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG до 5MB
                    </p>
                  </div>
                </Label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя клиента *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Введите полное имя"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="example@email.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+7 (999) 123-45-67"
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Статус клиента</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "vip" | "regular" | "new") => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full" />
                        Новый
                      </div>
                    </SelectItem>
                    <SelectItem value="regular">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        Постоянный
                      </div>
                    </SelectItem>
                    <SelectItem value="vip">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-revenue rounded-full" />
                        VIP
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Статистика клиента
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalBookings">Всего бронирований</Label>
                <Input
                  id="totalBookings"
                  type="number"
                  value={formData.totalBookings}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    totalBookings: parseInt(e.target.value) || 0 
                  }))}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSpent">Общая сумма (₼)</Label>
                <Input
                  id="totalSpent"
                  type="number"
                  value={formData.totalSpent}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    totalSpent: parseInt(e.target.value) || 0 
                  }))}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate">Дата регистрации</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate.split('T')[0]}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    joinDate: new Date(e.target.value).toISOString()
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastBooking">Последнее бронирование</Label>
                <Input
                  id="lastBooking"
                  type="date"
                  value={formData.lastBooking.split('T')[0]}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    lastBooking: new Date(e.target.value).toISOString()
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Действия */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate("/clients")}
          >
            Отмена
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-primary hover:bg-primary-hover"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </div>
      </form>
    </div>
  );
} 