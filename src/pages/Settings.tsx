import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { AccessDenied } from "@/components/AccessDenied";
import { 
  Settings as SettingsIcon, 
  Save,
  Plus,
  Trash2,
  Edit,
  Users,
  Globe,
  Phone,
  Mail,
  MapPin,
  Shield,
  Bell,
  Palette
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { CategoryModal } from "@/components/CategoryModal";
import { UserModal } from "@/components/UserModal";

const categories = [
  { id: 1, name: "Эконом", description: "Доступные автомобили", active: true },
  { id: 2, name: "Бизнес", description: "Комфортабельные авто", active: true },
  { id: 3, name: "Премиум", description: "Автомобили люкс класса", active: true },
  { id: 4, name: "Джип", description: "Внедорожники и кроссоверы", active: true }
];

const users = [
  { 
    id: 1, 
    name: "Администратор", 
    email: "admin@rentacar.az", 
    role: "admin",
    lastLogin: "2024-06-15",
    active: true
  },
  { 
    id: 2, 
    name: "Менеджер", 
    email: "manager@rentacar.az", 
    role: "manager",
    lastLogin: "2024-06-14",
    active: true
  },
  { 
    id: 3, 
    name: "Оператор", 
    email: "operator@rentacar.az", 
    role: "operator",
    lastLogin: "2024-06-13",
    active: false
  }
];

export default function Settings() {
  const { hasPermission } = useAuth();
  const { settings, updateSettings } = useData();
  const { toast } = useToast();
  
  // Все useState хуки должны быть в начале компонента
  const [categoriesList, setCategoriesList] = useState(categories);
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[0] | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Состояние для пользователей
  const [usersList, setUsersList] = useState(users);
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  const [companyInfo, setCompanyInfo] = useState({
    name: settings.companyName,
    email: settings.companyEmail,
    phone: settings.companyPhone,
    address: settings.companyAddress,
    currency: settings.currency,
    timezone: settings.timezone,
    language: settings.language
  });

  const [notifications, setNotifications] = useState(settings.notifications);

  const [seoSettings, setSeoSettings] = useState({
    title: "Аренда автомобилей в Баку - RentaCar",
    description: "Лучший сервис аренды автомобилей в Азербайджане. Широкий выбор машин, доступные цены, профессиональное обслуживание.",
    keywords: "аренда авто, прокат машин, автомобили напрокат, Баку, Азербайджан"
  });

  const [termsConditions, setTermsConditions] = useState(
    "1. Общие положения\n\nНастоящие условия аренды определяют порядок предоставления услуг аренды автомобилей.\n\n2. Права и обязанности сторон\n\nАрендатор обязуется:\n- Предоставить действующие документы\n- Соблюдать правила дорожного движения\n- Вернуть автомобиль в оговоренное время\n\n3. Ответственность\n\nЗа нарушение условий договора стороны несут ответственность в соответствии с действующим законодательством."
  );
  
  // Проверяем разрешение на просмотр настроек
  if (!hasPermission('settings', 'view')) {
    return (
      <AccessDenied 
        title="Настройки недоступны"
        description="Управление системными настройками доступно только администраторам системы."
      />
    );
  }

  // Функции для работы с категориями
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: typeof categories[0]) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
      setCategoriesList(prev => prev.filter(cat => cat.id !== categoryId));
      toast({
        title: "Успешно",
        description: "Категория удалена"
      });
    }
  };

  const handleSaveCategory = (categoryData: Omit<typeof categories[0], 'id'>) => {
    const newCategory = {
      ...categoryData,
      id: Math.max(...categoriesList.map(cat => cat.id), 0) + 1
    };
    setCategoriesList(prev => [...prev, newCategory]);
    toast({
      title: "Успешно",
      description: "Категория создана"
    });
  };

  const handleUpdateCategory = (categoryId: number, categoryData: Partial<typeof categories[0]>) => {
    setCategoriesList(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, ...categoryData } : cat
    ));
    toast({
      title: "Успешно",
      description: "Категория обновлена"
    });
  };

  // Функции для работы с пользователями
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: typeof users[0]) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      setUsersList(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Успешно",
        description: "Пользователь удален"
      });
    }
  };

  const handleSaveUser = (userData: Omit<typeof users[0], 'id' | 'lastLogin'>) => {
    const newUser = {
      ...userData,
      id: Math.max(...usersList.map(user => user.id), 0) + 1,
      lastLogin: new Date().toISOString().split('T')[0]
    } as typeof users[0];
    setUsersList(prev => [...prev, newUser]);
    toast({
      title: "Успешно",
      description: "Пользователь создан"
    });
  };

  const handleUpdateUser = (userId: number, userData: Partial<typeof users[0]>) => {
    setUsersList(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
    toast({
      title: "Успешно",
      description: "Пользователь обновлен"
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-destructive text-destructive-foreground">Админ</Badge>;
      case "manager":
        return <Badge className="bg-primary text-primary-foreground">Менеджер</Badge>;
      case "operator":
        return <Badge className="bg-success text-success-foreground">Оператор</Badge>;
      default:
        return <Badge variant="outline">Пользователь</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Настройки
          </h1>
          <p className="text-muted-foreground">Управление системными настройками</p>
        </div>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-fit grid-cols-5">
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="company">Компания</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="terms">Условия</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Категории автомобилей
                </CardTitle>
                <Button 
                  className="bg-gradient-primary hover:bg-primary-hover"
                  onClick={handleAddCategory}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить категорию
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoriesList.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Palette className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={category.active} 
                        onCheckedChange={(checked) => handleUpdateCategory(category.id, { active: checked })}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Пользователи системы
                </CardTitle>
                <Button 
                  className="bg-gradient-primary hover:bg-primary-hover"
                  onClick={handleAddUser}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить пользователя
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usersList.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.name}</h3>
                          {getRoleBadge(user.role)}
                          {!user.active && <Badge variant="outline">Неактивен</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Последний вход: {new Date(user.lastLogin).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={user.active} 
                        onCheckedChange={(checked) => handleUpdateUser(user.id, { active: checked })}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Информация о компании
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Название компании</Label>
                  <Input 
                    id="company-name"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="company-email">Email</Label>
                  <Input 
                    id="company-email"
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-phone">Телефон</Label>
                  <Input 
                    id="company-phone"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="company-currency">Валюта</Label>
                  <Input 
                    id="company-currency"
                    value={companyInfo.currency}
                    onChange={(e) => setCompanyInfo({...companyInfo, currency: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company-address">Адрес</Label>
                <Input 
                  id="company-address"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-timezone">Часовой пояс</Label>
                  <Input 
                    id="company-timezone"
                    value={companyInfo.timezone}
                    onChange={(e) => setCompanyInfo({...companyInfo, timezone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="company-language">Язык</Label>
                  <Input 
                    id="company-language"
                    value={companyInfo.language}
                    onChange={(e) => setCompanyInfo({...companyInfo, language: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  className="bg-gradient-primary hover:bg-primary-hover"
                  onClick={() => {
                    updateSettings({
                      companyName: companyInfo.name,
                      companyEmail: companyInfo.email,
                      companyPhone: companyInfo.phone,
                      companyAddress: companyInfo.address,
                      currency: companyInfo.currency,
                      timezone: companyInfo.timezone,
                      language: companyInfo.language,
                      notifications: notifications
                    });
                    toast({
                      title: "Успешно",
                      description: "Настройки компании сохранены"
                    });
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                SEO настройки
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo-title">Meta Title</Label>
                <Input 
                  id="seo-title"
                  value={seoSettings.title}
                  onChange={(e) => setSeoSettings({...seoSettings, title: e.target.value})}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Рекомендуемая длина: до 60 символов
                </p>
              </div>

              <div>
                <Label htmlFor="seo-description">Meta Description</Label>
                <Textarea 
                  id="seo-description"
                  value={seoSettings.description}
                  onChange={(e) => setSeoSettings({...seoSettings, description: e.target.value})}
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Рекомендуемая длина: до 160 символов
                </p>
              </div>

              <div>
                <Label htmlFor="seo-keywords">Ключевые слова</Label>
                <Input 
                  id="seo-keywords"
                  value={seoSettings.keywords}
                  onChange={(e) => setSeoSettings({...seoSettings, keywords: e.target.value})}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Разделяйте ключевые слова запятыми
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-primary hover:bg-primary-hover">
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить SEO
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Условия аренды
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="terms-content">Текст условий</Label>
                <Textarea 
                  id="terms-content"
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  className="min-h-[300px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Используйте встроенный текстовый редактор для форматирования
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-primary hover:bg-primary-hover">
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить условия
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Модальные окна */}
      <CategoryModal
        category={selectedCategory}
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        onUpdate={handleUpdateCategory}
      />

      <UserModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
}