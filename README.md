# RentLease - Car Rental Management System

A modern, full-stack car rental management application built with React, TypeScript, and Supabase.

## 🚀 Features

### Core Functionality
- **Car Management**: Add, edit, and manage your fleet of rental cars
- **Booking System**: Complete booking management with customer details
- **Financial Tracking**: Track revenue, expenses, and calculate net profit
- **Dashboard Analytics**: Comprehensive financial and performance analytics
- **User Management**: Role-based access (Admin/Manager)

### Key Components
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Real-time Data**: Supabase integration for live data updates
- **Financial Analytics**: Detailed revenue and expense tracking
- **Booking Management**: Complete customer and rental information
- **Image Management**: Google Drive integration for car photos

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI, Lucide React Icons
- **Charts**: Recharts
- **Date Handling**: date-fns

## 📊 Database Schema

### Cars Table
```sql
- id (SERIAL PRIMARY KEY)
- brand (VARCHAR)
- model (VARCHAR)
- year (INTEGER)
- color (VARCHAR)
- plate_number (VARCHAR UNIQUE)
- daily_rate (DECIMAL)
- owner_rate (DECIMAL)
- insurance_price (DECIMAL)
- is_available (BOOLEAN)
- description (TEXT)
- image_url (TEXT)
```

### Bookings Table
```sql
- id (SERIAL PRIMARY KEY)
- customer_name (VARCHAR)
- customer_country (VARCHAR)
- customer_phone (VARCHAR)
- car_id (INTEGER REFERENCES cars)
- car_name (VARCHAR)
- start_date (DATE)
- end_date (DATE)
- rental_days (INTEGER)
- delivery_to_airport (BOOLEAN)
- delivery_to_hotel (BOOLEAN)
- delivery_location (VARCHAR)
- full_insurance (BOOLEAN)
- total_amount (DECIMAL)
- daily_rate (DECIMAL)
- owner_amount (DECIMAL)
- my_income (DECIMAL)
- pickup_location (VARCHAR)
- return_location (VARCHAR)
- notes (TEXT)
- status (VARCHAR)
```

### Monthly Expenses Table
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- amount (DECIMAL)
- date (DATE)
- description (TEXT)
- is_recurring (BOOLEAN)
```

### Settings Table
```sql
- id (INTEGER PRIMARY KEY)
- company_name (VARCHAR)
- currency (VARCHAR)
- timezone (VARCHAR)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor
   - This will create all necessary tables, indexes, and sample data

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Radix UI)
│   ├── StatCard.tsx    # Dashboard statistics cards
│   └── ...
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Analytics dashboard
│   ├── Cars.tsx        # Car management
│   ├── Bookings.tsx    # Booking management
│   ├── Finances.tsx    # Financial overview
│   └── ...
├── lib/                # Utility libraries
│   ├── api/            # API integration layers
│   ├── supabase.ts     # Supabase client
│   └── ...
├── context/            # React contexts
│   └── SupabaseDataContext.tsx
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── ...
```

## 🔧 API Integration

The application uses a clean API layer pattern:

- **`carsApi`**: Car CRUD operations
- **`bookingsApi`**: Booking management
- **`financialApi`**: Expense management and analytics
- **`settingsApi`**: Application settings

## 📊 Financial Features

### Revenue Tracking
- Total revenue from bookings
- My income vs owner income breakdown
- Daily, monthly, and yearly analytics

### Expense Management
- Monthly expense tracking
- Recurring expense support
- Category-based expense organization

### Profit Analysis
- Net profit calculations
- Profit margin analysis
- Performance metrics by car

## 🎨 UI/UX Features

### Modern Design
- Gradient color schemes
- Smooth animations and transitions
- Responsive layout for all devices
- Dark/light theme support

### Dashboard Analytics
- Interactive charts (Line, Bar, Pie)
- Real-time statistics
- Performance metrics
- Financial summaries

## 🔐 Authentication & Security

- Supabase Auth integration
- Row Level Security (RLS) policies
- Role-based access control
- Secure API endpoints

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Adaptive layouts

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added financial analytics and expense tracking
- **v1.2.0**: Enhanced UI/UX and dashboard improvements

---

**Built with ❤️ using React, TypeScript, and Supabase**