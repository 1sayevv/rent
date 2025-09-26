import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  Car,
  DollarSign,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  Activity,
  Edit,
  Trash2,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { useData } from '@/context/SupabaseDataContext';
import { Client, Booking, Car as CarType } from '@/types';
import { clientsApi } from '@/lib/api/clients';
import { useToast } from '@/hooks/use-toast';

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, bookings, cars, deleteClient } = useData();
  const { toast } = useToast();

  // ID is now a UUID string, not a number
  const client = id ? clients.find(c => c.id === id) : null;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "vip":
        return <Badge className="bg-revenue text-revenue-foreground">VIP</Badge>;
      case "regular":
        return <Badge className="bg-primary text-primary-foreground">Regular</Badge>;
      case "new":
        return <Badge className="bg-success text-success-foreground">New</Badge>;
      default:
        return <Badge variant="outline">Regular</Badge>;
    }
  };

  // Get client bookings with error handling
  const clientBookings = bookings.filter(booking => booking.clientId === client?.id);

  // Client statistics with safe calculations
  const totalBookings = clientBookings.length;
  const totalSpent = clientBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
  const averageBookingValue = totalBookings > 0 ? totalSpent / totalBookings : 0;
  const lastBooking = clientBookings.length > 0 
    ? clientBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  // Favorite cars of the client
  const favoriteCars = clientBookings.reduce((acc, booking) => {
    const car = cars.find(c => c.id === booking.carId);
    if (car) {
      acc[car.name] = (acc[car.name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topFavoriteCar = Object.entries(favoriteCars)
    .sort(([,a], [,b]) => b - a)[0];

  // Booking statuses
  const bookingStatuses = clientBookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Monthly activity
  const monthlyActivity = clientBookings.reduce((acc, booking) => {
    try {
      const month = format(new Date(booking.createdAt), 'yyyy-MM');
      acc[month] = (acc[month] || 0) + 1;
    } catch (error) {
      console.warn('Error formatting date:', error);
    }
    return acc;
  }, {} as Record<string, number>);

  const recentActivity = Object.entries(monthlyActivity)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6);

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await clientsApi.delete(clientId);
        deleteClient(clientId);
        toast({
          title: "Success",
          description: "Client deleted successfully"
        });
        navigate('/clients');
      } catch (error) {
        console.error('Error deleting client:', error);
        toast({
          title: "Error",
          description: "Failed to delete client",
          variant: "destructive"
        });
      }
    }
  };

  if (!client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Button>
        </div>
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Client not found</h3>
          <p className="text-muted-foreground">
            The requested client does not exist or has been deleted
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Client Details
            </h1>
            <p className="text-muted-foreground">View and manage client information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/clients/edit/${client.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive"
            onClick={() => handleDeleteClient(client.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Client Profile Card */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{client.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(client.status)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {client.joinDate ? format(new Date(client.joinDate), 'MMM dd, yyyy') : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{totalBookings} bookings</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold text-primary">{totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-revenue">{totalSpent.toLocaleString()}₼</p>
              </div>
              <DollarSign className="h-8 w-8 text-revenue/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Booking</p>
                <p className="text-2xl font-bold text-success">{averageBookingValue.toLocaleString()}₼</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Booking</p>
                <p className="text-2xl font-bold text-warning">
                  {lastBooking ? format(new Date(lastBooking.createdAt), 'MMM dd') : 'Never'}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientBookings.length > 0 ? (
                  clientBookings
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((booking) => {
                      const car = cars.find(c => c.id === booking.carId);
                      return (
                        <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Car className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{car?.name || 'Unknown Car'}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-revenue">{booking.totalAmount}₼</p>
                            <Badge 
                              className={
                                booking.status === 'completed' ? 'bg-success text-success-foreground' :
                                booking.status === 'active' ? 'bg-primary text-primary-foreground' :
                                booking.status === 'confirmed' ? 'bg-warning text-warning-foreground' :
                                'bg-muted text-muted-foreground'
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Bookings</h3>
                    <p className="text-muted-foreground">This client hasn't made any bookings yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map(([month, count]) => (
                    <div key={month} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{format(new Date(month + '-01'), 'MMMM yyyy')}</p>
                          <p className="text-sm text-muted-foreground">{count} bookings</p>
                        </div>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Activity</h3>
                    <p className="text-muted-foreground">No recent activity to show</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Client Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topFavoriteCar ? (
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-revenue/10 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-revenue" />
                      </div>
                      <div>
                        <p className="font-medium">Favorite Car</p>
                        <p className="text-sm text-muted-foreground">
                          {topFavoriteCar[0]} ({topFavoriteCar[1]} bookings)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Preferences</h3>
                    <p className="text-muted-foreground">No booking history to determine preferences</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 