import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar,
  Save,
  ArrowLeft,
  Car,
  User,
  MapPin,
  DollarSign,
  Plane,
  Building2,
  Shield
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "@/context/SupabaseDataContext";
import { useToast } from "@/hooks/use-toast";

export default function AddBooking() {
  const { addBooking, cars } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerCountry: "",
    customerPhone: "",
    carId: "",
    startDate: "",
    endDate: "",
    deliveryToAirport: false,
    deliveryToHotel: false,
    deliveryLocation: "",
    fullInsurance: false,
    insurancePrice: "",
    totalAmount: "",
    customerRate: "",
    ownerRate: "",
    ownerAmount: "",
    myIncome: "",
    pickupLocation: "",
    returnLocation: "",
    notes: "",
    status: "pending"
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate rental days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Auto-calculate amounts if rates are set
      if (formData.customerRate && formData.ownerRate && diffDays > 0) {
        const customerRateValue = parseFloat(formData.customerRate);
        const ownerRateValue = parseFloat(formData.ownerRate);
        
        // Customer pays: customerRate * days
        const totalAmount = customerRateValue * diffDays;
        
        // Owner gets: ownerRate * days
        const ownerAmount = ownerRateValue * diffDays;
        
        // My income is: (customerRate - ownerRate) * days
        const rateDifference = customerRateValue - ownerRateValue;
        const myIncome = rateDifference * diffDays;
        
        setFormData(prev => ({ 
          ...prev, 
          totalAmount: totalAmount.toString(),
          ownerAmount: ownerAmount.toString(),
          myIncome: myIncome.toString()
        }));
      }
    }
  }, [formData.startDate, formData.endDate, formData.customerRate, formData.ownerRate]);

  const calculateRentalDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSaveBooking = () => {
    if (!formData.customerName || !formData.customerCountry || !formData.customerPhone || !formData.carId || 
        !formData.startDate || !formData.endDate || !formData.customerRate || !formData.ownerRate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedCar = cars.find(c => c.id === parseInt(formData.carId));
    if (!selectedCar) {
      toast({
        title: "Error",
        description: "Selected car not found",
        variant: "destructive"
      });
      return;
    }

    const bookingData = {
      customerName: formData.customerName,
      customerCountry: formData.customerCountry,
      customerPhone: formData.customerPhone,
      carId: parseInt(formData.carId),
      carName: `${selectedCar.brand} ${selectedCar.model}`,
      startDate: formData.startDate,
      endDate: formData.endDate,
      rentalDays: calculateRentalDays(),
      deliveryToAirport: formData.deliveryToAirport,
      deliveryToHotel: formData.deliveryToHotel,
      deliveryLocation: formData.deliveryLocation || undefined,
      fullInsurance: formData.fullInsurance,
      totalAmount: parseFloat(formData.totalAmount),
      dailyRate: parseFloat(formData.customerRate) || 0,
      ownerAmount: parseFloat(formData.ownerAmount) || 0,
      myIncome: parseFloat(formData.myIncome) || 0,
      pickupLocation: formData.pickupLocation,
      returnLocation: formData.returnLocation,
      notes: formData.notes || undefined,
      status: formData.status as 'confirmed' | 'pending' | 'active' | 'completed' | 'cancelled'
    };

    addBooking(bookingData);
    
    toast({
      title: "Success",
      description: "Booking created successfully"
    });

    navigate("/bookings");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            New Booking
          </h1>
          <p className="text-muted-foreground">Add a new booking to the system</p>
        </div>
        <Link to="/bookings">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input 
                    id="customerName"
                    placeholder="John Smith"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="customerCountry">Country *</Label>
                  <Input 
                    id="customerCountry"
                    placeholder="USA"
                    value={formData.customerCountry}
                    onChange={(e) => handleInputChange("customerCountry", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input 
                  id="customerPhone"
                  placeholder="+1 555 123 4567"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Car & Dates */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Car & Rental Period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Car *</Label>
                <Select value={formData.carId} onValueChange={(value) => handleInputChange("carId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a car" />
                  </SelectTrigger>
                  <SelectContent>
                    {cars.filter(car => car.isAvailable).map((car) => (
                      <SelectItem key={car.id} value={car.id.toString()}>
                        {car.brand} {car.model} - {car.dailyRate}₼/day
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input 
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input 
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                  />
                </div>
              </div>

              {formData.startDate && formData.endDate && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">
                    Rental Duration: {calculateRentalDays()} days
                  </p>
                </div>
              )}
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
                  <Label>Pickup Location *</Label>
                  <Select value={formData.pickupLocation} onValueChange={(value) => handleInputChange("pickupLocation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pickup location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="Airport">Airport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Return Location *</Label>
                  <Select value={formData.returnLocation} onValueChange={(value) => handleInputChange("returnLocation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select return location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="Airport">Airport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Additional Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deliveryToAirport"
                  checked={formData.deliveryToAirport}
                  onCheckedChange={(checked) => handleInputChange("deliveryToAirport", checked as boolean)}
                />
                <Label htmlFor="deliveryToAirport" className="flex items-center gap-2 cursor-pointer">
                  <Plane className="h-4 w-4" />
                  Airport Delivery
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deliveryToHotel"
                  checked={formData.deliveryToHotel}
                  onCheckedChange={(checked) => handleInputChange("deliveryToHotel", checked as boolean)}
                />
                <Label htmlFor="deliveryToHotel" className="flex items-center gap-2 cursor-pointer">
                  <Building2 className="h-4 w-4" />
                  Hotel Delivery
                </Label>
              </div>

              {(formData.deliveryToAirport || formData.deliveryToHotel) && (
                <div>
                  <Label htmlFor="deliveryLocation">Delivery Location Details</Label>
                  <Input 
                    id="deliveryLocation"
                    placeholder="Specific location details"
                    value={formData.deliveryLocation}
                    onChange={(e) => handleInputChange("deliveryLocation", e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fullInsurance"
                    checked={formData.fullInsurance}
                    onCheckedChange={(checked) => handleInputChange("fullInsurance", checked as boolean)}
                  />
                  <Label htmlFor="fullInsurance" className="flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4" />
                    Full Insurance
                  </Label>
                </div>
                
                {formData.fullInsurance && (
                  <div>
                    <Label htmlFor="insurancePrice">Insurance Price per Day (₼) - Info Only</Label>
                    <Input 
                      id="insurancePrice"
                      type="number"
                      placeholder="10"
                      value={formData.insurancePrice}
                      onChange={(e) => handleInputChange("insurancePrice", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">For your reference only - doesn't affect calculations</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Any additional information..."
                className="min-h-[100px]"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Financial */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-revenue">
                <DollarSign className="h-5 w-5" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerRate">Customer Rate (₼) *</Label>
                <Input 
                  id="customerRate"
                  type="number"
                  placeholder="90"
                  value={formData.customerRate}
                  onChange={(e) => handleInputChange("customerRate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Price you charge to customer</p>
              </div>

              <div>
                <Label htmlFor="ownerRate">Owner Rate (₼) *</Label>
                <Input 
                  id="ownerRate"
                  type="number"
                  placeholder="70"
                  value={formData.ownerRate}
                  onChange={(e) => handleInputChange("ownerRate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Price you pay to car owner</p>
              </div>

              <div>
                <Label htmlFor="totalAmount">Total Amount (₼)</Label>
                <Input 
                  id="totalAmount"
                  type="number"
                  placeholder="2000"
                  value={formData.totalAmount}
                  readOnly
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground mt-1">Customer Rate × Days</p>
              </div>

              <div className="border-t pt-4">
                <Label htmlFor="ownerAmount">Owner Amount (₼)</Label>
                <Input 
                  id="ownerAmount"
                  type="number"
                  placeholder="1500"
                  value={formData.ownerAmount}
                  readOnly
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground mt-1">Owner Rate × Days</p>
              </div>

              <div>
                <Label htmlFor="myIncome">My Income (₼)</Label>
                <Input 
                  id="myIncome"
                  type="number"
                  value={formData.myIncome}
                  readOnly
                  className="bg-success/10 font-bold text-success"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(parseFloat(formData.customerRate || '0') - parseFloat(formData.ownerRate || '0')).toFixed(0)}₼/day profit
                  {formData.fullInsurance && formData.insurancePrice ? ` (Insurance: ${formData.insurancePrice}₼/day - info only)` : ''}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Button 
            className="w-full bg-gradient-primary hover:bg-primary-hover" 
            size="lg"
            onClick={handleSaveBooking}
          >
            <Save className="h-4 w-4 mr-2" />
            Create Booking
          </Button>
        </div>
      </div>
    </div>
  );
}

