import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { AccessDenied } from "@/components/AccessDenied";
import { 
  Download, 
  Upload, 
  Database, 
  Trash2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";

export default function DataManager() {
  const { hasPermission } = useAuth();
  const { 
    cars, 
    clients, 
    bookings, 
    financialRecords, 
    settings,
    setCars,
    setClients,
    setBookings,
    setFinancialRecords,
    setSettings
  } = useData();
  
  const { toast } = useToast();
  const [importFile, setImportFile] = useState<File | null>(null);

  // Проверяем разрешение на управление данными
  if (!hasPermission('data', 'view')) {
    return (
      <AccessDenied 
        title="Управление данными недоступно"
        description="Управление данными системы доступно только администраторам."
      />
    );
  }

  const exportData = () => {
    const data = {
      cars,
      clients,
      bookings,
      financialRecords,
      settings,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auto-manage-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Успешно",
      description: "Данные экспортированы"
    });
  };

  const importData = () => {
    if (!importFile) {
      toast({
        title: "Ошибка",
        description: "Выберите файл для импорта",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.cars) setCars(data.cars);
        if (data.clients) setClients(data.clients);
        if (data.bookings) setBookings(data.bookings);
        if (data.financialRecords) setFinancialRecords(data.financialRecords);
        if (data.settings) setSettings(data.settings);

        toast({
          title: "Успешно",
          description: "Данные импортированы"
        });
        
        setImportFile(null);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Неверный формат файла",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(importFile);
  };

  const clearAllData = () => {
    if (window.confirm("Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.")) {
      setCars([]);
      setClients([]);
      setBookings([]);
      setFinancialRecords([]);
      
      toast({
        title: "Успешно",
        description: "Все данные удалены"
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setImportFile(file);
    } else {
      toast({
        title: "Ошибка",
        description: "Выберите JSON файл",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Управление данными
        </h1>
        <p className="text-muted-foreground">Экспорт и импорт данных системы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Статистика данных */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Статистика данных
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary">{cars.length}</p>
                <p className="text-sm text-muted-foreground">Автомобилей</p>
              </div>
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <p className="text-2xl font-bold text-success">{clients.length}</p>
                <p className="text-sm text-muted-foreground">Клиентов</p>
              </div>
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <p className="text-2xl font-bold text-warning">{bookings.length}</p>
                <p className="text-sm text-muted-foreground">Бронирований</p>
              </div>
              <div className="text-center p-3 bg-revenue/10 rounded-lg">
                <p className="text-2xl font-bold text-revenue">{financialRecords.length}</p>
                <p className="text-sm text-muted-foreground">Финансовых записей</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Экспорт данных */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Экспорт данных
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Скачайте все данные системы в формате JSON для резервного копирования
            </p>
            <Button 
              className="w-full bg-gradient-primary hover:bg-primary-hover"
              onClick={exportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Экспортировать данные
            </Button>
          </CardContent>
        </Card>

        {/* Импорт данных */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Импорт данных
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Загрузите файл с данными для восстановления из резервной копии
            </p>
            <div className="space-y-2">
              <Label htmlFor="import-file">Выберите JSON файл</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileChange}
              />
            </div>
            {importFile && (
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle className="h-4 w-4" />
                Файл выбран: {importFile.name}
              </div>
            )}
            <Button 
              className="w-full"
              onClick={importData}
              disabled={!importFile}
            >
              <Upload className="h-4 w-4 mr-2" />
              Импортировать данные
            </Button>
          </CardContent>
        </Card>

        {/* Очистка данных */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Очистка данных
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">
                Внимание: Это действие удалит все данные без возможности восстановления
              </p>
            </div>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={clearAllData}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить все данные
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 