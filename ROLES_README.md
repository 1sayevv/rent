# User Role System

## Overview

The system implements a role-based system with two access levels:
- **Administrator (admin)** - full access to all functions
- **Manager (manager)** - limited access to basic functions

## Test Credentials

### Administrator
- **Email:** admin@mail.com
- **Password:** 1234
- **Access:** All system functions

### Manager
- **Email:** manager@mail.com
- **Password:** 1234
- **Access:** Limited functions

## Access Rights by Role

### Administrator (admin)
✅ **Full access to all functions:**
- Dashboard (full version with analytics)
- Car management (view, add, edit, delete)
- Booking management (full functionality)
- Client management (full functionality)
- Finances (analytics, reports, export)
- System settings
- Data management (export/import)

### Manager (manager)
✅ **Available functions:**
- Dashboard (simplified version)
  - Number of available and rented cars
  - List of active bookings
  - Today's schedule (car pickup/return)
  - New bookings

- Car management
  - View car list
  - Add new cars
  - Edit car information
  - Delete cars

- Booking management
  - View booking list
  - Confirm/reject bookings
  - Complete bookings
  - Booking calendar

- Client management
  - View client list
  - Add new clients
  - Edit client information
  - View client booking history

❌ **Unavailable functions:**
- Finances (analytics, reports)
- System settings
- Data management

## Technical Implementation

### Main Components

1. **useAuth.ts** - hook for managing authentication and roles
2. **ProtectedRoute.tsx** - component for protecting routes
3. **RoleIndicator.tsx** - role indicator in interface
4. **AccessDenied.tsx** - component for displaying unavailability message

### Permission System

```typescript
const managerPermissions = {
  'dashboard': ['view'],
  'cars': ['view', 'create', 'edit', 'delete'],
  'bookings': ['view', 'create', 'edit', 'confirm', 'reject', 'complete'],
  'clients': ['view', 'create', 'edit'],
  'finances': [], // No access
  'settings': [], // No access
  'data': [] // No access
};
```

### Permission Checking

```typescript
// In components
const { hasPermission } = useAuth();

if (!hasPermission('finances', 'view')) {
  return <AccessDenied />;
}

// In routes
<Route path="/finances" element={
  <ProtectedRoute requiredPermission={{ resource: 'finances', action: 'view' }}>
    <Finances />
  </ProtectedRoute>
} />
```

## Interface

### Role Display
- Sidebar shows panel type (Admin Panel / Manager Panel)
- User profile shows role with corresponding badge
- Header displays role indicator

### Adaptive Menu
- Manager sees only available menu items
- Hidden items: Finances, Settings, Data

### Unavailability Notifications
- When trying to access unavailable pages, AccessDenied component is shown
- Automatic redirect to main page

## Security

- Permission checking happens at component and route level
- User role is stored in localStorage along with authentication data
- When permissions are missing, user is redirected to available pages

## System Extension

To add new roles:

1. Update `UserRole` type in `types/index.ts`
2. Add permissions in `useAuth.ts`
3. Update components to check new permissions
4. Add credentials in `Login.tsx` 