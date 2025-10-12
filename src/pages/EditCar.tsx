import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Car,
  Save,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useData } from "@/context/SupabaseDataContext";
import { useToast } from "@/hooks/use-toast";
import { carsApi } from "@/lib/api/cars";

export default function EditCar() {
  const { id } = useParams();
  const { cars, updateCar } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    plateNumber: "",
    dailyRate: "",
    ownerRate: "",
    insurancePrice: "",
    isAvailable: true,
    description: "",
    imageUrl: ""
  });

  // Load car data when component loads
  useEffect(() => {
    const loadCar = async () => {
      if (!id) {
        console.log('No ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Loading car with ID:', id);
        const car = await carsApi.getById(id);
        if (car) {
          console.log('Loaded car data:', car);
          setFormData({
            brand: car.brand,
            model: car.model,
            year: car.year.toString(),
            color: car.color,
            plateNumber: car.plateNumber,
            dailyRate: car.dailyRate.toString(),
            ownerRate: car.ownerRate.toString(),
            insurancePrice: car.insurancePrice.toString(),
            isAvailable: car.isAvailable,
            description: car.description || "",
            imageUrl: car.imageUrl || ""
          });
        } else {
          toast({
            title: "Error",
            description: "Car not found",
            variant: "destructive"
          });
          navigate("/cars");
        }
      } catch (error) {
        console.error('Error loading car:', error);
        toast({
          title: "Error",
          description: `Failed to load car data: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
        navigate("/cars");
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id, toast, navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateCar = async () => {
    if (!formData.brand || !formData.model || !formData.dailyRate || !formData.ownerRate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "Car ID not found",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      console.log('Starting car update process for ID:', id);
      
      // Prepare data for update
      const updateData = {
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year) || 2024,
        color: formData.color,
        plateNumber: formData.plateNumber,
        dailyRate: parseFloat(formData.dailyRate),
        ownerRate: parseFloat(formData.ownerRate),
        insurancePrice: parseFloat(formData.insurancePrice) || 0,
        isAvailable: formData.isAvailable,
        description: formData.description,
        imageUrl: formData.imageUrl
      };

      console.log('Update data prepared:', updateData);

      // Update through API
      const updatedCar = await carsApi.update(Number(id), updateData);
      console.log('Car updated successfully:', updatedCar);
      
      // Also update through context for synchronization
      updateCar(Number(id), updateData);
      
      toast({
        title: "Success",
        description: "Car information updated successfully"
      });

      navigate("/cars");
    } catch (error) {
      console.error('Error updating car:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to update car information: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading car...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/cars">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-black">
            Edit Car
          </h1>
          <p className="text-black">Update car information</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Car Brand *</Label>
                <Input 
                  id="brand"
                  placeholder="Toyota"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input 
                  id="model"
                  placeholder="Camry"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input 
                  id="year"
                  type="number"
                  placeholder="2023"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input 
                  id="color"
                  placeholder="White"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="plateNumber">Plate Number</Label>
              <Input 
                id="plateNumber"
                placeholder="ABC123"
                value={formData.plateNumber}
                onChange={(e) => handleInputChange("plateNumber", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-revenue">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dailyRate">Daily Rate (₼) *</Label>
                <Input 
                  id="dailyRate"
                  type="number"
                  placeholder="90"
                  value={formData.dailyRate}
                  onChange={(e) => handleInputChange("dailyRate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Price to customer</p>
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
                <p className="text-xs text-muted-foreground mt-1">Price to owner</p>
              </div>
              <div>
                <Label htmlFor="insurancePrice">Insurance Price (₼)</Label>
                <Input 
                  id="insurancePrice"
                  type="number"
                  placeholder="10"
                  value={formData.insurancePrice}
                  onChange={(e) => handleInputChange("insurancePrice", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Per day</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Additional information about the car..."
              className="min-h-[100px]"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Image URL */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Image</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input 
              id="imageUrl"
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
            />
            {formData.imageUrl && (
              <div className="mt-4">
                <img 
                  src={formData.imageUrl} 
                  alt="Car preview" 
                  className="w-full max-w-md rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.isAvailable ? "available" : "unavailable"} 
              onValueChange={(value) => handleInputChange("isAvailable", value === "available")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Update Button */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <Button 
              className="w-full bg-gradient-primary hover:bg-primary-hover"
              onClick={handleUpdateCar}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Car
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
