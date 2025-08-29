import { FinancialRecord, Booking, Car, Client } from '@/types';

// Интерфейс для финансового отчета
export interface FinancialReport {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  totalDebts: number;
  monthlyData: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  topCars: Array<{
    name: string;
    revenue: number;
    bookings: number;
    avgPrice: number;
  }>;
  revenueByCategory: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  recentPayments: Array<{
    id: number;
    client: string;
    car: string;
    amount: number;
    date: string;
    method: string;
    status: string;
  }>;
  debts: Array<{
    id: number;
    client: string;
    car: string;
    amount: number;
    dueDate: string;
    daysOverdue: number;
  }>;
}

// Генерация CSV контента
export const generateCSV = (data: any[], headers: string[]): string => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    Object.values(row).map(value => 
      typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    ).join(',')
  );
  return [csvHeaders, ...csvRows].join('\n');
};

// Экспорт в CSV
export const exportToCSV = (data: any[], headers: string[], filename: string) => {
  const csvContent = generateCSV(data, headers);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Экспорт в Excel (XLSX) - упрощенная версия
export const exportToExcel = async (data: any[], sheetName: string, filename: string) => {
  try {
    // Создаем HTML таблицу и экспортируем как Excel
    const table = document.createElement('table');
    
    // Заголовки
    if (data.length > 0) {
      const headerRow = document.createElement('tr');
      Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
    }
    
    // Данные
    data.forEach(row => {
      const dataRow = document.createElement('tr');
      Object.values(row).forEach(value => {
        const td = document.createElement('td');
        td.textContent = String(value);
        dataRow.appendChild(td);
      });
      table.appendChild(dataRow);
    });
    
    // Создаем HTML документ
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>${sheetName}</title>
        </head>
        <body>
          ${table.outerHTML}
        </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  } catch (error) {
    console.error('Ошибка при экспорте в Excel:', error);
    throw new Error('Не удалось экспортировать в Excel.');
  }
};

// Экспорт в PDF - упрощенная версия
export const exportToPDF = async (report: FinancialReport, filename: string) => {
  try {
    // Создаем HTML документ для печати
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Финансовый отчет</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #666; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
            .metric { display: inline-block; margin: 10px; padding: 10px; background-color: #e8f4fd; border-radius: 5px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>Финансовый отчет</h1>
          <p><strong>Период:</strong> ${report.period}</p>
          
          <div class="summary">
            <h2>Основные показатели</h2>
            <div class="metric">
              <strong>Общий доход:</strong> ${report.totalRevenue.toLocaleString()}₼
            </div>
            <div class="metric">
              <strong>Общие расходы:</strong> ${report.totalExpenses.toLocaleString()}₼
            </div>
            <div class="metric">
              <strong>Чистая прибыль:</strong> ${report.totalProfit.toLocaleString()}₼
            </div>
            <div class="metric">
              <strong>Задолженности:</strong> ${report.totalDebts.toLocaleString()}₼
            </div>
          </div>
          
          <h2>Месячные данные</h2>
          <table>
            <thead>
              <tr>
                <th>Месяц</th>
                <th>Доходы</th>
                <th>Расходы</th>
                <th>Прибыль</th>
              </tr>
            </thead>
            <tbody>
              ${report.monthlyData.map(month => `
                <tr>
                  <td>${month.month}</td>
                  <td>${month.revenue.toLocaleString()}₼</td>
                  <td>${month.expenses.toLocaleString()}₼</td>
                  <td>${month.profit.toLocaleString()}₼</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h2>ТОП-5 машин по доходу</h2>
          <table>
            <thead>
              <tr>
                <th>Позиция</th>
                <th>Машина</th>
                <th>Доход</th>
                <th>Бронирования</th>
                <th>Средняя цена</th>
              </tr>
            </thead>
            <tbody>
              ${report.topCars.map((car, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${car.name}</td>
                  <td>${car.revenue.toLocaleString()}₼</td>
                  <td>${car.bookings}</td>
                  <td>${car.avgPrice}₼</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h2>Доходы по категориям</h2>
          <table>
            <thead>
              <tr>
                <th>Категория</th>
                <th>Доход</th>
                <th>Процент</th>
              </tr>
            </thead>
            <tbody>
              ${report.revenueByCategory.map(category => `
                <tr>
                  <td>${category.name}</td>
                  <td>${category.value.toLocaleString()}₼</td>
                  <td>${category.percentage}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    // Создаем новое окно для печати
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    } else {
      // Fallback: сохраняем как HTML файл
      const blob = new Blob([html], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename.replace('.pdf', '.html');
      link.click();
    }
  } catch (error) {
    console.error('Ошибка при экспорте в PDF:', error);
    throw new Error('Не удалось экспортировать в PDF.');
  }
};

// Подготовка данных для экспорта
export const prepareFinancialData = (
  financialRecords: FinancialRecord[],
  bookings: Booking[],
  cars: Car[],
  clients: Client[]
): FinancialReport => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Фильтрация данных за текущий год
  const currentYearRecords = financialRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getFullYear() === currentYear;
  });
  
  // Расчет месячных данных
  const monthlyData = Array.from({ length: 12 }, (_, month) => {
    const monthRecords = currentYearRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === month;
    });
    
    const revenue = monthRecords
      .filter(record => record.type === 'income')
      .reduce((sum, record) => sum + record.amount, 0);
    
    const expenses = monthRecords
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + record.amount, 0);
    
    const profit = revenue - expenses;
    
    return {
      month: new Date(currentYear, month).toLocaleDateString('ru-RU', { month: 'short' }),
      revenue,
      expenses,
      profit
    };
  });
  
  // Расчет общих показателей
  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  
  // ТОП машин по доходу
  const carRevenue = cars.map(car => {
    const carBookings = bookings.filter(booking => booking.carId === car.id);
    const revenue = carBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const avgPrice = carBookings.length > 0 ? revenue / carBookings.length : 0;
    
    return {
      name: car.name,
      revenue,
      bookings: carBookings.length,
      avgPrice: Math.round(avgPrice)
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  
  // Доходы по категориям
  const categoryRevenue = cars.reduce((acc, car) => {
    const carBookings = bookings.filter(booking => booking.carId === car.id);
    const revenue = carBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    acc[car.category] = (acc[car.category] || 0) + revenue;
    return acc;
  }, {} as Record<string, number>);
  
  const revenueByCategory = Object.entries(categoryRevenue).map(([name, value]) => ({
    name,
    value,
    percentage: Math.round((value / totalRevenue) * 100)
  })).sort((a, b) => b.value - a.value);
  
  // Последние платежи
  const recentPayments = bookings.slice(0, 10).map(booking => {
    const client = clients.find(c => c.id === booking.clientId);
    const car = cars.find(c => c.id === booking.carId);
    
    return {
      id: booking.id,
      client: client?.name || 'Неизвестный клиент',
      car: car?.name || 'Неизвестная машина',
      amount: booking.totalPrice,
      date: new Date(booking.createdAt).toLocaleDateString('ru-RU'),
      method: 'Карта', // Можно добавить поле в тип Booking
      status: booking.status === 'completed' ? 'completed' : 'pending'
    };
  });
  
  // Задолженности (примерные данные)
  const debts = bookings
    .filter(booking => booking.status === 'pending')
    .slice(0, 5)
    .map(booking => {
      const client = clients.find(c => c.id === booking.clientId);
      const car = cars.find(c => c.id === booking.carId);
      const dueDate = new Date(booking.createdAt);
      const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: booking.id,
        client: client?.name || 'Неизвестный клиент',
        car: car?.name || 'Неизвестная машина',
        amount: booking.totalPrice,
        dueDate: dueDate.toLocaleDateString('ru-RU'),
        daysOverdue: Math.max(0, daysOverdue)
      };
    });
  
  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);
  
  return {
    period: `${currentYear}`,
    totalRevenue,
    totalExpenses,
    totalProfit,
    totalDebts,
    monthlyData,
    topCars: carRevenue,
    revenueByCategory,
    recentPayments,
    debts
  };
};

// Основная функция экспорта
export const exportFinancialReport = async (
  format: 'csv' | 'excel' | 'pdf',
  report: FinancialReport
) => {
  const timestamp = new Date().toISOString().split('T')[0];
  
  try {
    switch (format) {
      case 'csv':
        // Экспорт месячных данных
        const monthlyHeaders = ['Месяц', 'Доходы', 'Расходы', 'Прибыль'];
        const monthlyData = report.monthlyData.map(month => ({
          Месяц: month.month,
          Доходы: month.revenue,
          Расходы: month.expenses,
          Прибыль: month.profit
        }));
        exportToCSV(monthlyData, monthlyHeaders, `financial_report_monthly_${timestamp}.csv`);
        
        // Экспорт ТОП машин
        const carsHeaders = ['Позиция', 'Машина', 'Доход', 'Бронирования', 'Средняя цена'];
        const carsData = report.topCars.map((car, index) => ({
          Позиция: index + 1,
          Машина: car.name,
          Доход: car.revenue,
          Бронирования: car.bookings,
          'Средняя цена': car.avgPrice
        }));
        exportToCSV(carsData, carsHeaders, `financial_report_cars_${timestamp}.csv`);
        break;
        
      case 'excel':
        await exportToExcel(
          report.monthlyData.map(month => ({
            Месяц: month.month,
            Доходы: month.revenue,
            Расходы: month.expenses,
            Прибыль: month.profit
          })),
          'Месячные данные',
          `financial_report_${timestamp}.xls`
        );
        break;
        
      case 'pdf':
        await exportToPDF(report, `financial_report_${timestamp}.html`);
        break;
        
      default:
        throw new Error('Неподдерживаемый формат экспорта');
    }
  } catch (error) {
    console.error('Ошибка при экспорте:', error);
    throw error;
  }
}; 