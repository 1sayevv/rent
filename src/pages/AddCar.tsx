import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Upload,
  X,
  Car,
  Save,
  ArrowLeft,
  ImagePlus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "@/context/SupabaseDataContext";
import { useToast } from "@/hooks/use-toast";
import DraggableImageGallery from "@/components/DraggableImageGallery";

export default function AddCar() {
  const { addCar } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    year: "",
    category: "",
    fuelType: "",
    transmission: "",
    seats: "",
    dailyPrice: "",
    weeklyPrice: "",
    monthlyPrice: "",
    mileage: "",
    status: "available",
    description: ""
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCar = () => {
    if (!formData.name || !formData.model || !formData.category || !formData.dailyPrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const carData = {
      name: formData.name,
      model: formData.model,
      year: formData.year,
      category: formData.category,
      pricePerDay: parseFloat(formData.dailyPrice),
      weeklyPrice: formData.weeklyPrice ? parseFloat(formData.weeklyPrice) : undefined,
      monthlyPrice: formData.monthlyPrice ? parseFloat(formData.monthlyPrice) : undefined,
      mileage: parseInt(formData.mileage) || 0,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      seats: parseInt(formData.seats) || 5,
      status: formData.status as 'available' | 'rented' | 'maintenance' | 'unavailable',
      description: formData.description,
      image: images[0] || "/placeholder.svg",
      images: images.length > 0 ? images : undefined
    };

    addCar(carData);
    
    toast({
      title: "Success",
      description: "Car added to fleet"
    });

    navigate("/cars");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/cars">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Add Car
          </h1>
          <p className="text-muted-foreground">Fill in information about the new car</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Form */}
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
                  <Label htmlFor="name">Car Name</Label>
                  <Input 
                    id="name"
                    placeholder="Toyota"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
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
                  <Label htmlFor="year">Year of Manufacture</Label>
                  <Input 
                    id="year"
                    type="number"
                    placeholder="2023"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage (km)</Label>
                  <Input 
                    id="mileage"
                    type="number"
                    placeholder="15000"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange("mileage", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="sport">Sport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fuel Type</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Transmission</Label>
                  <Select value={formData.transmission} onValueChange={(value) => handleInputChange("transmission", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="seats">Number of Seats</Label>
                  <Input 
                    id="seats"
                    type="number"
                    min="2"
                    max="9"
                    placeholder="5"
                    value={formData.seats}
                    onChange={(e) => handleInputChange("seats", e.target.value)}
                  />
                </div>
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
                  <Label htmlFor="dailyPrice">Price per day (₼)</Label>
                  <Input 
                    id="dailyPrice"
                    type="number"
                    placeholder="45"
                    value={formData.dailyPrice}
                    onChange={(e) => handleInputChange("dailyPrice", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="weeklyPrice">Price per week (₼)</Label>
                  <Input 
                    id="weeklyPrice"
                    type="number"
                    placeholder="280"
                    value={formData.weeklyPrice}
                    onChange={(e) => handleInputChange("weeklyPrice", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyPrice">Price per month (₼)</Label>
                  <Input 
                    id="monthlyPrice"
                    type="number"
                    placeholder="1100"
                    value={formData.monthlyPrice}
                    onChange={(e) => handleInputChange("monthlyPrice", e.target.value)}
                  />
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

          {/* Status */}
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
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Upload Insurance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Upload Registration
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="shadow-card">
            <CardContent className="pt-6 space-y-3">
              <Button 
                className="w-full bg-gradient-primary hover:bg-primary-hover"
                onClick={handleSaveCar}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Car
              </Button>
              <Button variant="outline" className="w-full">
                Save as Draft
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Images Upload */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-primary" />
              Photos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-smooth">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload photos
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 10MB
                </p>
              </label>
            </div>

            {images.length > 0 && (
              <DraggableImageGallery
                images={images}
                onImagesChange={handleImagesChange}
                onRemoveImage={removeImage}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}