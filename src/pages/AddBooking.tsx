import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Save,
  ArrowLeft,
  Calendar,
  User,
  Car,
  MapPin
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "@/context/SupabaseDataContext";
import { useToast } from "@/hooks/use-toast";

export default function AddBooking() {
  const { addBooking, cars, clients } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    clientId: "",
    carId: "",
    startDate: "",
    endDate: "",
    pickupLocation: "",
    returnLocation: "",
    totalPrice: "",
    status: "pending",
    notes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveBooking = () => {
    if (!formData.clientId || !formData.carId || !formData.startDate || !formData.endDate || !formData.totalPrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedCar = cars.find(c => c.id === formData.carId);
    const selectedClient = clients.find(c => c.id === formData.clientId);

    if (!selectedCar || !selectedClient) {
      toast({
        title: "Error",
        description: "Selected car or client not found",
        variant: "destructive"
      });
      return;
    }

    const bookingData = {
      clientId: formData.clientId,
      carId: formData.carId,
      car: selectedCar.name,
      client: selectedClient,
      startDate: formData.startDate,
      endDate: formData.endDate,
      pickupLocation: formData.pickupLocation,
      returnLocation: formData.returnLocation,
      totalPrice: parseFloat(formData.totalPrice),
      status: formData.status as 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled',
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    addBooking(bookingData);
    
    toast({
      title: "Success",
      description: "Booking added successfully"
    });

    navigate("/bookings");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/bookings">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Add Booking
          </h1>
          <p className="text-muted-foreground">Create a new booking reservation</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Client Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Client</Label>
              <Select value={formData.clientId} onValueChange={(value) => handleInputChange("clientId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Car Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Car Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Car</Label>
              <Select value={formData.carId} onValueChange={(value) => handleInputChange("carId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a car" />
                </SelectTrigger>
                <SelectContent>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.name} - {car.model} ({car.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rental Dates */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Rental Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Locations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <Input 
                  id="pickupLocation"
                  placeholder="Airport, Hotel, etc."
                  value={formData.pickupLocation}
                  onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="returnLocation">Return Location</Label>
                <Input 
                  id="returnLocation"
                  placeholder="Airport, Hotel, etc."
                  value={formData.returnLocation}
                  onChange={(e) => handleInputChange("returnLocation", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Status */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Pricing & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalPrice">Total Price (₼)</Label>
                <Input 
                  id="totalPrice"
                  type="number"
                  placeholder="150"
                  value={formData.totalPrice}
                  onChange={(e) => handleInputChange("totalPrice", e.target.value)}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="Special requests, additional information..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="shadow-card">
          <CardContent className="pt-6 space-y-3">
            <Button 
              className="w-full bg-gradient-primary hover:bg-primary-hover"
              onClick={handleSaveBooking}
            >
              <Save className="h-4 w-4 mr-2" />
              Create Booking
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate("/bookings")}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 