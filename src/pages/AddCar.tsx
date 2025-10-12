import { useState, useEffect } from "react";
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
  ImagePlus,
  LogIn,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "@/context/SupabaseDataContext";
import { useToast } from "@/hooks/use-toast";
import DraggableImageGallery from "@/components/DraggableImageGallery";
import { 
  initializeGoogleDrive, 
  signInToGoogle, 
  uploadFileToGoogleDrive, 
  getDirectImageUrl,
  isSignedIn 
} from "@/lib/googleDrive";
import { 
  compressImages, 
  processImageFile, 
  formatFileSize,
  DEFAULT_COMPRESSION_OPTIONS 
} from "@/lib/imageCompression";
import { toast as sonnerToast } from "sonner";

export default function AddCar() {
  const { addCar } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [isGoogleDriveReady, setIsGoogleDriveReady] = useState(false);
  const [isLoggedInToGoogle, setIsLoggedInToGoogle] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    year: "",
    category: "",
    fuelType: "",
    transmission: "",
    seats: "",
    dailyPrice: "",
    status: "available",
    description: ""
  });

  // Initialize Google Drive
  useEffect(() => {
    const init = async () => {
      try {
        await initializeGoogleDrive();
        setIsGoogleDriveReady(true);
        setIsLoggedInToGoogle(isSignedIn());
      } catch (error) {
        console.error('Google Drive initialization error:', error);
      }
    };
    init();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInToGoogle();
      setIsLoggedInToGoogle(true);
      sonnerToast.success('Successfully signed in to Google!');
    } catch (error) {
      console.error('Google sign in error:', error);
      sonnerToast.error('Google sign in failed');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check Google Drive login
    if (!isLoggedInToGoogle) {
      sonnerToast.error('Please sign in to your Google account first');
      return;
    }

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      // First compress the images
      sonnerToast.loading('Compressing images...', { id: 'compression' });
      
      const compressedFiles = await compressImages(Array.from(files), DEFAULT_COMPRESSION_OPTIONS);
      
      sonnerToast.dismiss('compression');
      sonnerToast.success(`${compressedFiles.length} images compressed!`);
      
      // Upload each compressed file to Google Drive
      for (const file of compressedFiles) {
        const originalFile = Array.from(files).find(f => f.name.replace(/\.[^/.]+$/, '') === file.name.replace(/\.[^/.]+$/, ''));
        const originalSize = originalFile ? formatFileSize(originalFile.size) : 'unknown';
        const compressedSize = formatFileSize(file.size);
        
        sonnerToast.loading(`Uploading ${file.name}... (${originalSize} → ${compressedSize})`, { id: file.name });
        
        try {
          const result = await uploadFileToGoogleDrive(file);
          // Use alternative URL (for CORS issue)
          const imageUrl = (result as any).directImageUrl || getDirectImageUrl(result.id);
          uploadedUrls.push(imageUrl);
          
          sonnerToast.success(`${file.name} uploaded! (${compressedSize})`, { id: file.name });
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          sonnerToast.error(`Failed to upload ${file.name}`, { id: file.name });
        }
      }

      // Add uploaded URLs to state
      if (uploadedUrls.length > 0) {
        setImages(prev => [...prev, ...uploadedUrls]);
        sonnerToast.success(`${uploadedUrls.length} images uploaded to Google Drive!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      sonnerToast.error('Image upload error');
    } finally {
      setUploadingImages(false);
      // Clear input
      event.target.value = '';
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
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
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
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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

        </div>

          {/* Images Upload */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-primary" />
              Images (Google Drive)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Drive Login Status */}
            {isGoogleDriveReady && !isLoggedInToGoogle && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Sign in to Google Drive
                    </p>
                    <p className="text-xs text-yellow-600">
                      Images will be automatically uploaded to Google Drive
                    </p>
                  </div>
                </div>
                <Button onClick={handleGoogleSignIn} size="sm">
                  Sign In
                </Button>
              </div>
            )}

            {isLoggedInToGoogle && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                <p className="text-sm text-green-800">
                  Connected to Google Drive - Images will be uploaded automatically
                </p>
              </div>
            )}

            <div className={`border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-smooth ${
              uploadingImages ? 'opacity-50 pointer-events-none' : ''
            }`}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={!isLoggedInToGoogle || uploadingImages}
              />
              <label 
                htmlFor="image-upload" 
                className={`cursor-pointer ${!isLoggedInToGoogle ? 'opacity-50' : ''}`}
              >
                {uploadingImages ? (
                  <>
                    <Loader2 className="h-8 w-8 mx-auto text-primary mb-2 animate-spin" />
                    <p className="text-sm text-primary font-medium">
                      Uploading to Google Drive...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload images
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG - Automatically compressed and uploaded to Google Drive
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📦 Maximum size: 200KB (automatic compression)
                    </p>
                  </>
                )}
              </label>
            </div>

            {images.length > 0 && (
              <>
                <div className="text-sm text-muted-foreground">
                  {images.length} images uploaded (on Google Drive)
                </div>
                <DraggableImageGallery
                  images={images}
                  onImagesChange={handleImagesChange}
                  onRemoveImage={removeImage}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <Button 
              className="w-full bg-gradient-primary hover:bg-primary-hover"
              onClick={handleSaveCar}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Car
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}