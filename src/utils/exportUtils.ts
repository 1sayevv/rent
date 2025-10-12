import { FinancialRecord, Booking, Car, Client } from '@/types';

// Interface for financial report
export interface FinancialReport {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  bookings: number;
  cars: number;
}

// Generate CSV content
export const generateCSVContent = (data: FinancialReport[]): string => {
  const headers = ['Date', 'Revenue', 'Expenses', 'Profit', 'Bookings', 'Cars'];
  const csvRows = [headers.join(',')];

  data.forEach(row => {
    csvRows.push([
      row.date,
      row.revenue.toString(),
      row.expenses.toString(),
      row.profit.toString(),
      row.bookings.toString(),
      row.cars.toString()
    ].join(','));
  });

  return csvRows.join('\n');
};

// Export to CSV
export const exportToCSV = (data: FinancialReport[], filename: string = 'financial-report.csv') => {
  const csvContent = generateCSVContent(data);
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

// Export to Excel (XLSX) - simplified version
export const exportToExcel = (data: FinancialReport[], filename: string = 'financial-report.xlsx') => {
  // Create HTML table and export as Excel
  const table = document.createElement('table');
  const headers = ['Date', 'Revenue', 'Expenses', 'Profit', 'Bookings', 'Cars'];
  
  // Create header row
  const headerRow = table.insertRow();
  headers.forEach(header => {
    const cell = headerRow.insertCell();
    cell.textContent = header;
    cell.style.fontWeight = 'bold';
  });

  // Create data rows
  data.forEach(row => {
    const dataRow = table.insertRow();
    Object.values(row).forEach(value => {
      const cell = dataRow.insertCell();
      cell.textContent = value.toString();
    });
  });

  // Apply basic styling
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';
  
  // Convert table to HTML and download
  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>Financial Report</title>
      </head>
      <body>
        ${table.outerHTML}
      </body>
    </html>
  `;
  
  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

// Export to PDF - simplified version
export const exportToPDF = async (report: FinancialReport, filename: string) => {
  try {
    // Create HTML document for printing
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Financial Report</title>
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
          <h1>Financial Report</h1>
          <p><strong>Period:</strong> ${report.date}</p>
          
          <div class="summary">
            <h2>Key Indicators</h2>
            <div class="metric">
              <strong>Total Revenue:</strong> ${report.revenue.toLocaleString()}₼
            </div>
            <div class="metric">
              <strong>Total Expenses:</strong> ${report.expenses.toLocaleString()}₼
            </div>
            <div class="metric">
              <strong>Net Profit:</strong> ${report.profit.toLocaleString()}₼
            </div>
            <div class="metric">
              <strong>Debts:</strong> ${report.bookings.toLocaleString()}₼
            </div>
          </div>
          
          <h2>Monthly Data</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
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
          
          <h2>Top 5 Cars by Revenue</h2>
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Car</th>
                <th>Revenue</th>
                <th>Bookings</th>
                <th>Average Price</th>
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
          
          <h2>Revenue by Category</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Revenue</th>
                <th>Percentage</th>
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
    
    // Create new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    } else {
      // Fallback: save as HTML file
      const blob = new Blob([html], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename.replace('.pdf', '.html');
      link.click();
    }
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export to PDF.');
  }
};

// Prepare data for export
export const prepareFinancialData = (
  financialRecords: FinancialRecord[],
  bookings: Booking[],
  cars: Car[],
  clients: Client[]
): FinancialReport => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Filter data for current year
  const currentYearRecords = financialRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getFullYear() === currentYear;
  });
  
  // Calculate monthly data
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
      month: new Date(currentYear, month).toLocaleDateString('en-US', { month: 'short' }),
      revenue,
      expenses,
      profit
    };
  });
  
  // Calculate total indicators
  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  
  // Top cars by revenue
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
  
  // Revenue by category
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
  
  // Recent payments
  const recentPayments = bookings.slice(0, 10).map(booking => {
    const client = clients.find(c => c.id === booking.clientId);
    const car = cars.find(c => c.id === booking.carId);
    
    return {
      id: booking.id,
      client: client?.name || 'Unknown Client',
      car: car?.name || 'Unknown Car',
      amount: booking.totalPrice,
      date: new Date(booking.createdAt).toLocaleDateString('en-US'),
      method: 'Card', // Can add field to Booking type
      status: booking.status === 'completed' ? 'completed' : 'pending'
    };
  });
  
  // Debts (approximate data)
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
        client: client?.name || 'Unknown Client',
        car: car?.name || 'Unknown Car',
        amount: booking.totalPrice,
        dueDate: dueDate.toLocaleDateString('en-US'),
        daysOverdue: Math.max(0, daysOverdue)
      };
    });
  
  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);
  
  return {
    date: `${currentYear}`,
    revenue: totalRevenue,
    expenses: totalExpenses,
    profit: totalProfit,
    totalRevenue: totalRevenue,  // Добавляем для совместимости
    totalProfit: totalProfit,    // Добавляем для совместимости
    bookings: totalDebts,
    cars: cars.length,
    monthlyData,
    topCars: carRevenue,
    revenueByCategory,
    recentPayments,
    debts
  };
};

// Main export function
export const exportFinancialReport = async (
  format: 'csv' | 'excel' | 'pdf',
  report: FinancialReport
) => {
  const timestamp = new Date().toISOString().split('T')[0];
  
  try {
    switch (format) {
      case 'csv':
        // Export monthly data
        const monthlyHeaders = ['Month', 'Revenue', 'Expenses', 'Profit'];
        const monthlyData = report.monthlyData.map(month => ({
          Month: month.month,
          Revenue: month.revenue,
          Expenses: month.expenses,
          Profit: month.profit
        }));
        exportToCSV(monthlyData, `financial_report_monthly_${timestamp}.csv`);
        
        // Export top cars
        const carsHeaders = ['Position', 'Car', 'Revenue', 'Bookings', 'Average Price'];
        const carsData = report.topCars.map((car, index) => ({
          Position: index + 1,
          Car: car.name,
          Revenue: car.revenue,
          Bookings: car.bookings,
          'Average Price': car.avgPrice
        }));
        exportToCSV(carsData, `financial_report_cars_${timestamp}.csv`);
        break;
        
      case 'excel':
        await exportToExcel(
          report.monthlyData.map(month => ({
            Month: month.month,
            Revenue: month.revenue,
            Expenses: month.expenses,
            Profit: month.profit
          })),
          'Monthly Data',
          `financial_report_${timestamp}.xls`
        );
        break;
        
      case 'pdf':
        await exportToPDF(report, `financial_report_${timestamp}.html`);
        break;
        
      default:
        throw new Error('Unsupported export format');
    }
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}; 