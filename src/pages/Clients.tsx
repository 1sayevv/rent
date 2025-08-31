import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Phone, 
  Mail,
  Calendar,
  Star,
  Eye,
  Edit,
  UserPlus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useData } from "@/context/DataContext";
import { Client } from "@/types";
import { useNavigate } from "react-router-dom";



export default function Clients() {
  const { clients, deleteClient, bookings, cars } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const vipClients = clients.filter(c => c.status === "vip").length;
  const regularClients = clients.filter(c => c.status === "regular").length;
  const newClients = clients.filter(c => c.status === "new").length;
  const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0);

  const handleEditClient = (client: Client) => {
    // Переход на страницу редактирования клиента
    navigate(`/clients/edit/${client.id}`);
  };

  const handleDeleteClient = (clientId: number) => {
    deleteClient(clientId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Клиенты
          </h1>
          <p className="text-muted-foreground">Управление клиентской базой</p>
        </div>
        <Button 
          className="bg-gradient-primary hover:bg-primary-hover"
          onClick={() => navigate("/clients/add")}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Добавить клиента
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего клиентов</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VIP клиенты</p>
                <p className="text-2xl font-bold text-revenue">{vipClients}</p>
              </div>
              <div className="w-8 h-8 bg-revenue/20 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-revenue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Новые клиенты</p>
                <p className="text-2xl font-bold text-success">{newClients}</p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Общий доход</p>
                <p className="text-2xl font-bold text-revenue">{totalRevenue.toLocaleString()}₼</p>
              </div>
              <div className="w-8 h-8 bg-revenue/20 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-revenue" />
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
                placeholder="Поиск по имени, email или телефону..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Статус клиента" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="regular">Постоянный</SelectItem>
                <SelectItem value="new">Новый</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="shadow-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    {getStatusBadge(client.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{client.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{client.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Клиент с {new Date(client.joinDate).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{client.totalBookings}</p>
                  <p className="text-xs text-muted-foreground">Бронирований</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-revenue">{client.totalSpent}₼</p>
                  <p className="text-xs text-muted-foreground">Потрачено</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Просмотр
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditClient(client)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Изменить
                </Button>
              </div>

              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Последнее бронирование: {new Date(client.lastBooking).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Клиенты не найдены</h3>
          <p className="text-muted-foreground mb-4">
            Попробуйте изменить параметры поиска или фильтры
          </p>
        </div>
      )}


    </div>
  );
}