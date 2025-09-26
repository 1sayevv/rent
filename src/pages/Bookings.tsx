import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Search,
  Check,
  X,
  Eye,
  Car,
  User,
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";
import { useData } from "@/context/SupabaseDataContext";
import { BookingCalendar } from "@/components/BookingCalendar";
import { BookingDetailsModal } from "@/components/BookingDetailsModal";
import { useNavigate } from "react-router-dom";
import { Booking } from "@/types";



export default function Bookings() {
  const { bookings, updateBooking, deleteBooking, cars, clients } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-success-foreground">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "active":
        return <Badge className="bg-primary text-primary-foreground">Active</Badge>;
      case "completed":
        return <Badge className="bg-muted text-muted-foreground">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive text-destructive-foreground">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.car.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const activeBookings = bookings.filter(b => b.status === "active").length;

  // Functions for working with calendar
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    // Here you can add navigation to edit page
    console.log('Edit booking:', booking);
  };

  const handleDeleteBooking = (bookingId: number) => {
    // Delete booking
    if (confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(bookingId);
    }
  };

  const handleStatusChange = (bookingId: number, status: string) => {
    updateBooking(bookingId, { status: status as any });
  };

  const handleAddBooking = () => {
    // Here you can add navigation to add booking page
    console.log('Add booking');
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Bookings
          </h1>
          <p className="text-muted-foreground">Order and reservation management</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Calendar className="h-4 w-4 mr-2" />
          Calendar
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-success">{confirmedBookings}</p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{pendingBookings}</p>
              </div>
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-primary">{activeBookings}</p>
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Car className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by client or car..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <TabsContent value="list" className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="shadow-card hover:shadow-elevated transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Booking #{booking.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(booking.createdAt).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                    <div className="text-right">
                      <p className="font-bold text-xl text-revenue">{booking.totalPrice}₼</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Client
                    </div>
                    <div>
                      <p className="font-medium">{booking.client.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {booking.client.phone}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {booking.client.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Car className="h-4 w-4" />
                      Car
                    </div>
                    <div>
                      <p className="font-medium">{booking.car}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Rental Dates
                    </div>
                    <div>
                      <p className="font-medium">
                        {new Date(booking.startDate).toLocaleDateString('en-US')} - {new Date(booking.endDate).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Locations
                    </div>
                    <div>
                      <p className="text-sm">Pickup: {booking.pickupLocation}</p>
                      <p className="text-sm">Return: {booking.returnLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewBooking(booking)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {booking.status === "pending" && (
                    <>
                      <Button 
                        size="sm" 
                        className="bg-success hover:bg-success/90"
                        onClick={() => updateBooking(booking.id, { status: 'confirmed' })}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => updateBooking(booking.id, { status: 'cancelled' })}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {booking.status === "active" && (
                    <Button 
                      size="sm" 
                      className="bg-warning hover:bg-warning/90"
                      onClick={() => updateBooking(booking.id, { status: 'completed' })}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar">
          <BookingCalendar
            bookings={bookings}
            cars={cars}
            onViewBooking={handleViewBooking}
            onEditBooking={handleEditBooking}
            onDeleteBooking={handleDeleteBooking}
            onAddBooking={handleAddBooking}
          />
        </TabsContent>
      </Tabs>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
          <p className="text-muted-foreground mb-4">
            Try changing search parameters or filters
          </p>
        </div>
      )}

      {/* Booking details modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onEdit={handleEditBooking}
        onDelete={handleDeleteBooking}
        onStatusChange={handleStatusChange}
        car={selectedBooking ? cars.find(c => c.name === selectedBooking.car) : undefined}
        client={selectedBooking ? clients.find(c => c.id === selectedBooking.clientId) : undefined}
      />
    </div>
  );
}