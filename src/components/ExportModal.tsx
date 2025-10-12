import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download,
  FileText,
  File,
  Calendar,
  Car,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { FinancialReport, exportFinancialReport } from '@/utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: FinancialReport;
}

export function ExportModal({ isOpen, onClose, report }: ExportModalProps) {
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('excel');
  const [period, setPeriod] = useState<'current_year' | 'current_month' | 'all_time'>('current_year');
  const [sections, setSections] = useState({
    monthlyData: true,
    topCars: true,
    revenueByCategory: true,
    recentPayments: true,
    debts: true
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    {
      value: 'excel',
      label: 'Excel (.xlsx)',
      description: 'Best format for data analysis',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      value: 'csv',
      label: 'CSV (.csv)',
      description: 'Simple text format',
      icon: Download,
      color: 'text-blue-600'
    },
    {
      value: 'pdf',
      label: 'PDF (.pdf)',
      description: 'Format for printing and presentations',
      icon: File,
      color: 'text-red-600'
    }
  ];

  const periodOptions = [
    {
      value: 'current_month',
      label: 'Current Month',
      description: 'Data for current month'
    },
    {
      value: 'current_year',
      label: 'Current Year',
      description: 'Data for current year'
    },
    {
      value: 'all_time',
      label: 'All Time',
      description: 'All available data'
    }
  ];

  const sectionOptions = [
    {
      key: 'monthlyData',
      label: 'Monthly Data',
      description: 'Income and expenses by month',
      icon: TrendingUp
    },
    {
      key: 'topCars',
      label: 'Top Cars',
      description: 'Best cars by revenue',
      icon: Car
    },
    {
      key: 'revenueByCategory',
      label: 'Revenue by Category',
      description: 'Revenue distribution by category',
      icon: DollarSign
    },
    {
      key: 'recentPayments',
      label: 'Recent Payments',
      description: 'History of recent payments',
      icon: Calendar
    },
    {
      key: 'debts',
      label: 'Debts',
      description: 'Overdue debts',
      icon: AlertTriangle
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Filter data based on selected period
      let filteredReport = { ...report };
      
      if (period === 'current_month') {
        const currentMonth = new Date().getMonth();
        filteredReport.monthlyData = report.monthlyData.filter((_, index) => index === currentMonth);
      }
      
      // Filter sections
      if (!sections.monthlyData) filteredReport.monthlyData = [];
      if (!sections.topCars) filteredReport.topCars = [];
      if (!sections.revenueByCategory) filteredReport.revenueByCategory = [];
      if (!sections.recentPayments) filteredReport.recentPayments = [];
      if (!sections.debts) filteredReport.debts = [];
      
      await exportFinancialReport(format, filteredReport);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      alert('An error occurred during export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSectionToggle = (key: string) => {
    setSections(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const selectedFormat = formatOptions.find(option => option.value === format);
  const FormatIcon = selectedFormat?.icon || FileText;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Financial Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">File Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formatOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        format === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setFormat(option.value as 'csv' | 'excel' | 'pdf')}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-6 w-6 ${option.color}`} />
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Period Selection */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Data Period</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Section Selection */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Include in Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectionOptions.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div key={section.key} className="flex items-center space-x-3">
                      <Checkbox
                        id={section.key}
                        checked={sections[section.key as keyof typeof sections]}
                        onCheckedChange={() => handleSectionToggle(section.key)}
                      />
                      <Label htmlFor={section.key} className="flex items-center gap-3 cursor-pointer">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{section.label}</p>
                          <p className="text-sm text-muted-foreground">{section.description}</p>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Format:</span>
                  <span className="font-medium">{selectedFormat?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Period:</span>
                  <span className="font-medium">
                    {periodOptions.find(p => p.value === period)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sections included:</span>
                  <span className="font-medium">
                    {Object.values(sections).filter(Boolean).length} of {sectionOptions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-medium text-revenue">{report.totalRevenue?.toLocaleString() || '0'}₼</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Net Profit:</span>
                  <span className="font-medium text-success">{report.totalProfit?.toLocaleString() || '0'}₼</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="bg-gradient-primary hover:bg-primary-hover"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FormatIcon className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 