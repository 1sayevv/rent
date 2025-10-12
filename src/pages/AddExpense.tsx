import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft,
  Save,
  DollarSign,
  Calendar,
  FileText,
  Building,
  Car,
  Phone,
  Zap,
  TrendingUp
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const expenseCategories = [
  { value: "office_rent", label: "Office Rent", icon: Building },
  { value: "utilities", label: "Utilities (Electricity, Water)", icon: Zap },
  { value: "internet", label: "Internet & Phone", icon: Phone },
  { value: "car_maintenance", label: "Car Maintenance", icon: Car },
  { value: "insurance", label: "Insurance", icon: FileText },
  { value: "marketing", label: "Marketing & Advertising", icon: TrendingUp },
  { value: "other", label: "Other", icon: FileText },
];

export default function AddExpense() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    description: ""
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveExpense = () => {
    if (!formData.name || !formData.amount || !formData.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally save to database
    // For now, we'll just show success and navigate back
    console.log('Expense data:', formData);
    
    toast({
      title: "Success",
      description: "Expense created successfully"
    });

    navigate("/finances");
  };

  const getCategoryIcon = (categoryValue: string) => {
    const category = expenseCategories.find(cat => cat.value === categoryValue);
    return category ? category.icon : FileText;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Add Expense
          </h1>
          <p className="text-muted-foreground">Add a new expense to track your monthly costs</p>
        </div>
        <Link to="/finances">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Expense Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Expense Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Expense Name *</Label>
                <Input 
                  id="name"
                  placeholder="e.g., Office Rent for October"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>


              <div>
                <Label htmlFor="amount">Amount (₼) *</Label>
                <Input 
                  id="amount"
                  type="number"
                  placeholder="800"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="date">Date *</Label>
                <Input 
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description"
                  placeholder="Additional details about this expense"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) => handleInputChange("isRecurring", checked as boolean)}
                />
                <Label htmlFor="isRecurring" className="text-sm">
                  Recurring monthly expense
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Check this if this expense repeats every month
              </p>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  {formData.category && (() => {
                    const Icon = getCategoryIcon(formData.category);
                    return <Icon className="h-5 w-5 text-primary" />;
                  })()}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{formData.name || "Expense Name"}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.category ? expenseCategories.find(cat => cat.value === formData.category)?.label : "Category"}
                    {formData.isRecurring && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">Recurring</span>
                    )}
                  </p>
                </div>
                <p className="font-bold text-destructive">{formData.amount || "0"}₼</p>
              </div>
              {formData.date && (
                <p className="text-sm text-muted-foreground">
                  Date: {new Date(formData.date).toLocaleDateString('en-US')}
                </p>
              )}
            </CardContent>
          </Card>

          <Button 
            className="w-full bg-gradient-primary hover:bg-primary-hover" 
            size="lg"
            onClick={handleSaveExpense}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Expense
          </Button>
        </div>
      </div>
    </div>
  );
}
