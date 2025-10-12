import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Car, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Fuel,
  Settings,
  Calendar,
  Users
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "@/context/SupabaseDataContext";
import { Car as CarType } from "@/types";

export default function Cars() {
  const { cars, deleteCar } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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


  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "available" && car.isAvailable) ||
                         (statusFilter === "rented" && !car.isAvailable);
    
    return matchesSearch && matchesStatus;
  });

  const availableCars = cars.filter(car => car.isAvailable).length;
  const rentedCars = cars.filter(car => !car.isAvailable).length;
  const maintenanceCars = 0; // Not tracked in new schema

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Fleet
          </h1>
          <p className="text-black">Car management</p>
        </div>
        <Link to="/cars/add">
          <Button className="bg-gradient-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Add Car
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cars</p>
                <p className="text-2xl font-bold">{cars.length}</p>
              </div>
              <Car className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-success">{availableCars}</p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <Car className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rented</p>
                <p className="text-2xl font-bold text-warning">{rentedCars}</p>
              </div>
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Maintenance</p>
                <p className="text-2xl font-bold text-destructive">{maintenanceCars}</p>
              </div>
              <div className="w-8 h-8 bg-destructive/20 rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-destructive" />
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
                placeholder="Search by brand or model..." 
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <Card key={car.id} className="shadow-card hover:shadow-elevated transition-smooth overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {car.imageUrl && car.imageUrl !== "/placeholder.svg" ? (
                <img 
                  src={car.imageUrl} 
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-500">
                    <Car className="h-8 w-8 mx-auto mb-1" />
                    <p className="text-xs">No image</p>
                  </div>
                </div>
              )}
              <div className="absolute top-3 right-3">
                {getStatusBadge(car.isAvailable ? "available" : "rented")}
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{car.brand}</h3>
                  <p className="text-sm text-muted-foreground">{car.model} • {car.year}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    {car.plateNumber || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1">
                    {car.color || 'N/A'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-primary">{car.dailyRate}₼</p>
                    <p className="text-xs text-muted-foreground">per day</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Owner: {car.ownerRate}₼</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 overflow-hidden">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-w-0"
                    onClick={() => navigate(`/cars/${car.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">View</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-w-0"
                    onClick={() => navigate(`/cars/edit/${car.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteCar(car.id)}
                    className="text-destructive hover:bg-destructive/10 flex-shrink-0 w-9 h-9 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No cars found</h3>
          <p className="text-muted-foreground mb-4">
            Try changing search parameters or filters
          </p>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      )}


    </div>
  );
}