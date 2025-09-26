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
import { useData } from "@/context/SupabaseDataContext";
import { useToast } from "@/hooks/use-toast";
import { CategoryModal } from "@/components/CategoryModal";
import { UserModal } from "@/components/UserModal";

const categories = [
  { id: 1, name: "Economy", description: "Affordable cars", active: true },
  { id: 2, name: "Business", description: "Comfortable cars", active: true },
  { id: 3, name: "Premium", description: "Luxury class cars", active: true },
  { id: 4, name: "SUV", description: "Off-road vehicles and crossovers", active: true }
];

const users = [
  { 
    id: 1, 
    name: "Administrator", 
    email: "admin@rentacar.az", 
    role: "admin",
    lastLogin: "2024-06-15",
    active: true
  },
  { 
    id: 2, 
    name: "Manager", 
    email: "manager@rentacar.az", 
    role: "manager",
    lastLogin: "2024-06-14",
    active: true
  },
  { 
    id: 3, 
    name: "Operator", 
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

  // State for users
  const [usersList, setUsersList] = useState(users);
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  const [companyInfo, setCompanyInfo] = useState({
    name: settings?.companyName || "Auto Manage Suite",
    email: settings?.companyEmail || "info@automanage.az",
    phone: settings?.companyPhone || "+994 12 345 67 89",
    address: settings?.companyAddress || "Baku, Azerbaijan",
    currency: settings?.currency || "₼",
    timezone: settings?.timezone || "Asia/Baku",
    language: settings?.language || "ru"
  });
  
  // Проверка на undefined ПОСЛЕ всех хуков
  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка настроек...</p>
        </div>
      </div>
    );
  }

  const [notifications, setNotifications] = useState(settings.notifications);

  const [seoSettings, setSeoSettings] = useState({
    title: "Car Rental in Baku - RentaCar",
    description: "Best car rental service in Azerbaijan. Wide selection of cars, affordable prices, professional service.",
    keywords: "car rental, car hire, rent a car, Baku, Azerbaijan"
  });

  const [termsConditions, setTermsConditions] = useState(
    "1. General Provisions\n\nThese rental terms define the procedure for providing car rental services.\n\n2. Rights and Obligations of the Parties\n\nThe Renter undertakes to:\n- Provide valid documents\n- Comply with traffic rules\n- Return the car at the agreed time\n\n3. Liability\n\nFor violation of the contract terms, the parties bear responsibility in accordance with current legislation."
  );
  
  // Check permission to view settings
  if (!hasPermission('settings', 'view')) {
    return (
      <AccessDenied 
        title="Settings unavailable"
        description="System settings management is only available to system administrators."
      />
    );
  }

  // Functions for working with categories
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: typeof categories[0]) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategoriesList(prev => prev.filter(cat => cat.id !== categoryId));
      toast({
        title: "Success",
        description: "Category deleted"
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
      title: "Success",
      description: "Category created"
    });
  };

  const handleUpdateCategory = (categoryId: number, categoryData: Partial<typeof categories[0]>) => {
    setCategoriesList(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, ...categoryData } : cat
    ));
    toast({
      title: "Success",
      description: "Category updated"
    });
  };

  // Functions for working with users
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: typeof users[0]) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsersList(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted"
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
      title: "Success",
      description: "User created"
    });
  };

  const handleUpdateUser = (userId: number, userData: Partial<typeof users[0]>) => {
    setUsersList(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
    toast({
      title: "Success",
      description: "User updated"
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-destructive text-destructive-foreground">Admin</Badge>;
      case "manager":
        return <Badge className="bg-primary text-primary-foreground">Manager</Badge>;
      case "operator":
        return <Badge className="bg-success text-success-foreground">Operator</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground">System settings management</p>
        </div>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-fit grid-cols-5">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Car Categories
                </CardTitle>
                <Button 
                  className="bg-gradient-primary hover:bg-primary-hover"
                  onClick={handleAddCategory}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
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
                  System Users
                </CardTitle>
                <Button 
                  className="bg-gradient-primary hover:bg-primary-hover"
                  onClick={handleAddUser}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
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
                          {!user.active && <Badge variant="outline">Inactive</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Last login: {new Date(user.lastLogin).toLocaleDateString('en-US')}
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
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
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
                  <Label htmlFor="company-phone">Phone</Label>
                  <Input 
                    id="company-phone"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="company-currency">Currency</Label>
                  <Input 
                    id="company-currency"
                    value={companyInfo.currency}
                    onChange={(e) => setCompanyInfo({...companyInfo, currency: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company-address">Address</Label>
                <Input 
                  id="company-address"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-timezone">Timezone</Label>
                  <Input 
                    id="company-timezone"
                    value={companyInfo.timezone}
                    onChange={(e) => setCompanyInfo({...companyInfo, timezone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="company-language">Language</Label>
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
                      title: "Success",
                      description: "Company settings saved"
                    });
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
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
                SEO Settings
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
                  Recommended length: up to 60 characters
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
                  Recommended length: up to 160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="seo-keywords">Keywords</Label>
                <Input 
                  id="seo-keywords"
                  value={seoSettings.keywords}
                  onChange={(e) => setSeoSettings({...seoSettings, keywords: e.target.value})}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate keywords with commas
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-primary hover:bg-primary-hover">
                  <Save className="h-4 w-4 mr-2" />
                  Save SEO
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
                Rental Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="terms-content">Terms Text</Label>
                <Textarea 
                  id="terms-content"
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  className="min-h-[300px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use the built-in text editor for formatting
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-gradient-primary hover:bg-primary-hover">
                  <Save className="h-4 w-4 mr-2" />
                  Save Terms
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal windows */}
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