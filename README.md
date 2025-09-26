# Auto Manage Suite

Car rental management system with all data stored in browser localStorage.

## Features

- **Authentication System**: Secure login for administrators with separate login page
- **Complete localStorage Storage**: All data (cars, clients, bookings, finances, settings) automatically saved in browser localStorage
- **Data Export/Import**: Ability to export all data to JSON file and import from backup
- **Car Management**: Add, edit, delete cars
- **Client Management**: Client database with booking history
- **Booking System**: Create and manage bookings with various statuses
- **Financial Accounting**: Track income and expenses
- **System Settings**: Company configuration and system parameters

## Data Structure

### Cars
- Basic information (name, model, year)
- Technical specifications (fuel, transmission, mileage)
- Pricing (daily, weekly, monthly rates)
- Status (available, rented, under maintenance)
- Images

### Clients
- Contact information (name, email, phone)
- Statistics (number of bookings, total amount)
- Status (VIP, regular, new)
- Activity history

### Bookings
- Connection with client and car
- Rental dates (start and end)
- Pickup and return locations
- Status (confirmed, pending, active, completed, cancelled)
- Total cost

### Financial Records
- Type (income/expense)
- Category
- Amount
- Description
- Date

### Settings
- Company information
- Currency and timezone
- Interface language
- Notification settings

## localStorage Functions

### Automatic Saving
All data changes are automatically saved in browser localStorage:
- `cars` - car data
- `clients` - client data  
- `bookings` - booking data
- `financialRecords` - financial records
- `settings` - system settings

### Data Export
- Download all data to JSON file
- Includes metadata (export date, version)
- Used for backup

### Data Import
- Load data from JSON file
- Complete replacement of existing data
- Restore from backup

### Data Cleanup
- Delete all data from localStorage
- Action confirmation to prevent accidental loss

## Installation and Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Usage

1. **System Login**: Go to `/login` and enter administrator credentials
2. **Add Car**: Go to "Cars" section → "Add Car"
3. **Client Management**: "Clients" section for working with client database
4. **Create Booking**: "Bookings" section for managing orders
5. **Settings**: "Settings" section for system configuration
6. **Data Management**: "Data" section for export/import

## Login Credentials

- **Email**: admin@mail.com
- **Password**: 1234

## Technical Details

- **React 18** with TypeScript
- **Vite** for building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management
- **localStorage API** for data storage

## Security

⚠️ **Important**: Data is stored locally in the user's browser. Data may be lost when clearing cache or changing browsers. Regular data export is recommended for backup.

## Browser Support

The system works in all modern browsers that support:
- localStorage API
- ES6+ syntax
- CSS Grid and Flexbox

## License

MIT License
