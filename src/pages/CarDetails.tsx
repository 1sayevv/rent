import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Car, 
  Fuel, 
  Settings, 
  Calendar, 
  MapPin, 
  DollarSign,
  Users,
  Clock,
  Star,
  FileText,
  Tag,
  Hash,
  ArrowLeft,
  Edit,
  User
} from "lucide-react";
import { useData } from "@/context/SupabaseDataContext";
import { Car as CarType } from "@/types";
import { carsApi } from "@/lib/api/cars";
import { useState, useEffect } from "react";

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cars } = useData();
  const [car, setCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug information
  console.log('CarDetails - URL params id:', id);
  console.log('CarDetails - cars from context:', cars);

  // Load car data from API
  useEffect(() => {
    const loadCar = async () => {
      if (!id) {
        setError("No car ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log('Loading car with ID:', id);
        const carData = await carsApi.getById(id);
        console.log('Car data loaded:', carData);
        setCar(carData);
        
        if (!carData) {
          setError(`Car with ID ${id} not found in database`);
        }
      } catch (error) {
        console.error('Error loading car:', error);
        setError(error instanceof Error ? error.message : 'Failed to load car');
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading car ID: {id}...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/cars')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Button>
        </div>
        <div className="text-center py-12">
          <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {error ? 'Error loading car' : 'Car not found'}
          </h3>
          <p className="text-muted-foreground">
            {error || `Car with ID ${id} doesn't exist.`}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Debug: ID = {id}
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-success text-success-foreground">Available</Badge>;
      case "rented":
        return <Badge className="bg-warning text-warning-foreground">Rented</Badge>;
      case "maintenance":
        return <Badge className="bg-destructive text-destructive-foreground">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Economy":
        return <Badge variant="outline" className="text-muted-foreground">Economy</Badge>;
      case "Business":
        return <Badge variant="outline" className="text-primary border-primary">Business</Badge>;
      case "Premium":
        return <Badge variant="outline" className="text-revenue border-revenue">Premium</Badge>;
      case "SUV":
        return <Badge variant="outline" className="text-success border-success">SUV</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/cars')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-black">
              Car Details
            </h1>
            <p className="text-muted-foreground">Detailed car information</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/cars/edit/${car.id}`)}
          className="bg-gradient-primary hover:bg-primary-hover"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {car.image && car.image !== "/placeholder.svg" ? (
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Image load error for:', car.image);
                        // Alternatif URL dene
                        const fileId = car.image.match(/[?&]id=([^&]+)/)?.[1];
                        if (fileId) {
                          e.currentTarget.src = `https://lh3.googleusercontent.com/d/${fileId}`;
                        } else {
                          e.currentTarget.src = "/placeholder.svg";
                        }
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', car.image);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-center text-gray-500">
                        <Car className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">No image</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(car.status)}
                  {getCategoryBadge(car.category)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Car Information */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">{car.name}</h2>
                  <p className="text-lg text-muted-foreground">{car.model}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Year of Manufacture: {car.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Category: {car.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Fuel Type: {car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Transmission: {car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Number of Seats: {car.seats}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Added: {new Date(car.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-black">Updated: {new Date(car.updatedAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prices */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-revenue" />
                Rates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-medium text-black">Price Per Day</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{car.pricePerDay}₼</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {car.description && (
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Description
                </h3>
                <div className="p-4 border rounded-lg bg-muted/30">
                  <p className="text-black leading-relaxed">{car.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Panel - Remove in production */}
        <Card className="shadow-card border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">🐛 Debug Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-yellow-800">Main Image:</p>
                <p className="text-yellow-700 break-all">{car.image || "NONE"}</p>
              </div>
              <div>
                <p className="font-medium text-yellow-800">Additional Images:</p>
                <p className="text-yellow-700">{car.images ? car.images.length : 0} items</p>
                {car.images && car.images.map((img, i) => (
                  <p key={i} className="text-xs text-yellow-600 break-all">{i+1}: {img}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Images */}
        {car.images && car.images.length > 0 && (
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-black">Additional Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {car.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${car.name} - photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Show placeholder if image fails to load
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technical Information */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Technical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="h-4 w-4 text-primary" />
                    <span className="font-medium text-black">Car ID</span>
                  </div>
                  <p className="text-lg font-bold text-primary">#{car.id}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium text-black">Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(car.status)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-success" />
                    <span className="font-medium text-black">Bookings</span>
                  </div>
                  <p className="text-2xl font-bold text-success">0</p>
                  <p className="text-sm text-muted-foreground">total</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-warning" />
                    <span className="font-medium text-black">Rating</span>
                  </div>
                  <p className="text-2xl font-bold text-warning">4.8</p>
                  <p className="text-sm text-muted-foreground">out of 5</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium text-black">Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">0₼</p>
                  <p className="text-sm text-muted-foreground">all time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 