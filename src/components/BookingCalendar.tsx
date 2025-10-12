import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar as CalendarIcon,
  Car,
  User,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, isSameDay, isWithinInterval, startOfDay, endOfDay, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Booking, Car as CarType } from '@/types';

interface BookingCalendarProps {
  bookings: Booking[];
  cars: CarType[];
  onViewBooking: (booking: Booking) => void;
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (bookingId: number) => void;
  onAddBooking: () => void;
}

export function BookingCalendar({
  bookings,
  cars,
  onViewBooking,
  onEditBooking,
  onDeleteBooking,
  onAddBooking
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [carFilter, setCarFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filter bookings based on selected filters
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const car = cars.find(c => c.id === booking.carId);
      const carMatch = carFilter === 'all' || car?.name === carFilter;
      const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
      return carMatch && statusMatch;
    });
  }, [bookings, cars, carFilter, statusFilter]);

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter(booking => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      return isWithinInterval(date, { start: startOfDay(startDate), end: endOfDay(endDate) });
    });
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dayBookings = getBookingsForDate(date);
    if (dayBookings.length > 0) {
      setSelectedBooking(dayBookings[0]);
      setIsBookingModalOpen(true);
    }
  };

  // Handle booking click
  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingModalOpen(true);
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(prev => subDays(startOfMonth(prev), 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => addDays(endOfMonth(prev), 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get calendar days
  const getCalendarDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const startDate = startOfDay(start);
    const endDate = endOfDay(end);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Add empty cells for days before the month starts
    const startDay = start.getDay();
    const emptyDays = startDay === 0 ? 6 : startDay - 1;
    for (let i = 0; i < emptyDays; i++) {
      days.unshift(subDays(startDate, i + 1));
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={carFilter} onValueChange={setCarFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All cars" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cars</SelectItem>
                {cars.map(car => (
                  <SelectItem key={car.id} value={car.name}>
                    {car.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
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

      {/* Calendar */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Booking Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              const dayBookings = getBookingsForDate(day);
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[100px] p-2 border border-border rounded-lg cursor-pointer transition-colors
                    ${isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
                    ${isToday ? 'ring-2 ring-primary' : ''}
                    ${selectedDate && isSameDay(day, selectedDate) ? 'bg-primary/10' : ''}
                    hover:bg-muted/50
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`
                      text-sm font-medium
                      ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                      ${isToday ? 'text-primary font-bold' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>
                    {dayBookings.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dayBookings.length}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayBookings.slice(0, 2).map(booking => {
                      const car = cars.find(c => c.id === booking.carId);
                      return (
                        <div
                          key={booking.id}
                          className="text-xs p-1 bg-primary/10 text-primary rounded cursor-pointer hover:bg-primary/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookingClick(booking);
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <Car className="h-3 w-3" />
                            <span className="truncate">{car ? `${car.brand} ${car.model}` : 'Unknown Car'}</span>
                          </div>
                        </div>
                      );
                    })}
                    {dayBookings.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayBookings.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Booking Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Car:</span>
                    <span>{(() => {
                      const car = cars.find(c => c.id === selectedBooking.carId);
                      return car ? `${car.brand} ${car.model}` : 'Unknown Car';
                    })()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Client:</span>
                    <span>Client #{selectedBooking.clientId}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Duration:</span>
                    <span>
                      {format(new Date(selectedBooking.startDate), 'MMM dd, yyyy')} - 
                      {format(new Date(selectedBooking.endDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-primary">{selectedBooking.totalAmount}₼</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <Badge 
                      className={
                        selectedBooking.status === 'confirmed' ? 'bg-success text-success-foreground' :
                        selectedBooking.status === 'active' ? 'bg-primary text-primary-foreground' :
                        selectedBooking.status === 'completed' ? 'bg-muted text-muted-foreground' :
                        'bg-destructive text-destructive-foreground'
                      }
                    >
                      {selectedBooking.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Pickup Location:</span>
                    <span>{selectedBooking.pickupLocation || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Return Location:</span>
                    <span>{selectedBooking.returnLocation || 'Not specified'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => onViewBooking(selectedBooking)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onEditBooking(selectedBooking)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => onDeleteBooking(selectedBooking.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 