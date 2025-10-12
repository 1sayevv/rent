import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Car,
  User,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Plane,
  Building2,
  Shield,
  Globe,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Booking, Car as CarType } from '@/types';
import { useNavigate } from 'react-router-dom';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: number) => void;
  onStatusChange: (bookingId: number, status: string) => void;
  car?: CarType;
}

export function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  car
}: BookingDetailsModalProps) {
  const navigate = useNavigate();
  
  if (!booking) return null;
  
  const handleEdit = () => {
    navigate(`/bookings/edit/${booking.id}`);
    onClose();
  };

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

  const getStatusActions = () => {
    switch (booking.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-success hover:bg-success/90"
              onClick={() => onStatusChange(booking.id, 'confirmed')}
            >
              <Check className="h-4 w-4 mr-1" />
              Confirm
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:bg-destructive/10"
              onClick={() => onStatusChange(booking.id, 'cancelled')}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        );
      case "confirmed":
        return (
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => onStatusChange(booking.id, 'active')}
          >
            <Car className="h-4 w-4 mr-1" />
            Start Rental
          </Button>
        );
      case "active":
        return (
          <Button 
            size="sm" 
            className="bg-success hover:bg-success/90"
            onClick={() => onStatusChange(booking.id, 'completed')}
          >
            <Check className="h-4 w-4 mr-1" />
            Complete
          </Button>
        );
      default:
        return null;
    }
  };


  const isOverdue = () => {
    const endDate = new Date(booking.endDate);
    const now = new Date();
    return booking.status === 'active' && endDate < now;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Booking Details #{booking.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Actions */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusBadge(booking.status)}
                  {isOverdue() && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {getStatusActions()}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this booking?')) {
                        onDelete(booking.id);
                        onClose();
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Car Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Car Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{booking.carName}</h3>
                  {car && (
                    <div className="space-y-2 mt-2">
                      <p className="text-sm text-muted-foreground">
                        Category: {car.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Fuel Type: {car.fuelType}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Transmission: {car.transmission}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mileage: {car.mileage.toLocaleString()} km
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.customerCountry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.customerPhone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Details */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Rental Period</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.startDate), 'dd MMMM yyyy', { locale: ru })} - {format(new Date(booking.endDate), 'dd MMMM yyyy', { locale: ru })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Duration: {booking.rentalDays} days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Locations</p>
                      <p className="text-sm text-muted-foreground">
                        Pickup: {booking.pickupLocation}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Return: {booking.returnLocation}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Services</p>
                    <div className="space-y-2">
                      {booking.deliveryToAirport && (
                        <div className="flex items-center gap-2 text-sm">
                          <Plane className="h-4 w-4 text-primary" />
                          <span>Airport Delivery</span>
                        </div>
                      )}
                      {booking.deliveryToHotel && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span>Hotel Delivery</span>
                        </div>
                      )}
                      {booking.fullInsurance && (
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4 text-primary" />
                          <span>Full Insurance</span>
                        </div>
                      )}
                      {!booking.deliveryToAirport && !booking.deliveryToHotel && !booking.fullInsurance && (
                        <p className="text-sm text-muted-foreground">No additional services</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div className="w-full">
                      <p className="font-medium mb-2">Financial Details</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Daily Rate:</span>
                          <span className="text-sm font-medium">{booking.dailyRate}₼</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Amount:</span>
                          <span className="text-sm font-bold text-revenue">{booking.totalAmount}₼</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Owner Amount:</span>
                            <span className="text-sm font-medium">{booking.ownerAmount}₼</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-success">My Income:</span>
                            <span className="text-sm font-bold text-success">{booking.myIncome}₼</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Created Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.createdAt), 'dd MMMM yyyy at HH:mm', { locale: ru })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {booking.notes && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{booking.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* History */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Booking created</span>
                  <span className="text-muted-foreground">
                    {format(new Date(booking.createdAt), 'dd.MM.yyyy HH:mm', { locale: ru })}
                  </span>
                </div>
                {booking.updatedAt !== booking.createdAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span>Booking updated</span>
                    <span className="text-muted-foreground">
                      {format(new Date(booking.updatedAt), 'dd.MM.yyyy HH:mm', { locale: ru })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}