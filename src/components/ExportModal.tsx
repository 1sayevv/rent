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
      description: 'Лучший формат для анализа данных',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      value: 'csv',
      label: 'CSV (.csv)',
      description: 'Простой текстовый формат',
      icon: Download,
      color: 'text-blue-600'
    },
    {
      value: 'pdf',
      label: 'PDF (.pdf)',
      description: 'Формат для печати и презентаций',
      icon: File,
      color: 'text-red-600'
    }
  ];

  const periodOptions = [
    {
      value: 'current_month',
      label: 'Текущий месяц',
      description: 'Данные за текущий месяц'
    },
    {
      value: 'current_year',
      label: 'Текущий год',
      description: 'Данные за текущий год'
    },
    {
      value: 'all_time',
      label: 'Все время',
      description: 'Все доступные данные'
    }
  ];

  const sectionOptions = [
    {
      key: 'monthlyData',
      label: 'Месячные данные',
      description: 'Доходы и расходы по месяцам',
      icon: TrendingUp
    },
    {
      key: 'topCars',
      label: 'ТОП машин',
      description: 'Лучшие машины по доходу',
      icon: Car
    },
    {
      key: 'revenueByCategory',
      label: 'Доходы по категориям',
      description: 'Распределение доходов по категориям',
      icon: DollarSign
    },
    {
      key: 'recentPayments',
      label: 'Последние платежи',
      description: 'История последних платежей',
      icon: Calendar
    },
    {
      key: 'debts',
      label: 'Задолженности',
      description: 'Просроченные задолженности',
      icon: AlertTriangle
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Фильтруем данные в зависимости от выбранного периода
      let filteredReport = { ...report };
      
      if (period === 'current_month') {
        const currentMonth = new Date().getMonth();
        filteredReport.monthlyData = report.monthlyData.filter((_, index) => index === currentMonth);
      }
      
      // Фильтруем секции
      if (!sections.monthlyData) filteredReport.monthlyData = [];
      if (!sections.topCars) filteredReport.topCars = [];
      if (!sections.revenueByCategory) filteredReport.revenueByCategory = [];
      if (!sections.recentPayments) filteredReport.recentPayments = [];
      if (!sections.debts) filteredReport.debts = [];
      
      await exportFinancialReport(format, filteredReport);
      onClose();
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      alert('Произошла ошибка при экспорте. Попробуйте еще раз.');
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
            Экспорт финансового отчета
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Выбор формата */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Формат файла</CardTitle>
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

          {/* Выбор периода */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Период данных</CardTitle>
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

          {/* Выбор секций */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Включить в отчет</CardTitle>
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

          {/* Предварительный просмотр */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Предварительный просмотр</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Формат:</span>
                  <span className="font-medium">{selectedFormat?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Период:</span>
                  <span className="font-medium">
                    {periodOptions.find(p => p.value === period)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Секций включено:</span>
                  <span className="font-medium">
                    {Object.values(sections).filter(Boolean).length} из {sectionOptions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Общий доход:</span>
                  <span className="font-medium text-revenue">{report.totalRevenue.toLocaleString()}₼</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Чистая прибыль:</span>
                  <span className="font-medium text-success">{report.totalProfit.toLocaleString()}₼</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Действия */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Отмена
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="bg-gradient-primary hover:bg-primary-hover"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Экспорт...
                </>
              ) : (
                <>
                  <FormatIcon className="h-4 w-4 mr-2" />
                  Экспортировать
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 