# Role-Based Dashboard System

A complete role-based access control (RBAC) system with separate dashboards for Super Admin, Admin, and User roles. Built with React + Vite frontend and Node.js backend.

## Features

- **Role-Based Access Control**: Three distinct roles (Super Admin, Admin, User) with specific permissions
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Frontend route protection based on user roles
- **Dashboard Management**:
  - Super Admin: Manage Admins and Users
  - Admin: Manage Users and create Notes
  - User: Create and manage personal Notes
- **CRUD Operations**: Create, Read, Update, Delete for Admins, Users, and Notes
- **Search & Pagination**: Efficient data browsing with search and pagination
- **Clean UI**: Modern, responsive design with intuitive navigation

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js          # API configuration with interceptors
│   ├── components/
│   │   ├── Navbar.jsx               # Navigation bar
│   │   ├── Sidebar.jsx              # Sidebar navigation
│   │   └── ProtectedRoute.jsx       # Route protection wrapper
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── hooks/
│   │   └── useAuth.js               # Custom auth hook
│   ├── pages/
│   │   ├── Login.jsx                # Login page
│   │   ├── Dashboard.jsx            # Role-specific dashboards
│   │   ├── Admins.jsx               # Admin management (Super Admin only)
│   │   ├── Users.jsx                # User management (Super Admin/Admin)
│   │   ├── Notes.jsx                # Notes management
│   │   └── Unauthorized.jsx         # Unauthorized access page
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles
├── vite.config.js
├── package.json
└── index.html
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Backend Setup

Ensure your backend is running on `http://localhost:5000` with the following endpoints:
- `POST /api/auth/login` - User login
- `POST /api/admins` - Create admin
- `GET /api/admins` - Get admins
- `PUT /api/admins/:id` - Update admin
- `DELETE /api/admins/:id` - Delete admin
- `POST /api/users` - Create user
- `GET /api/users` - Get users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/notes` - Create note
- `GET /api/notes` - Get notes
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Authentication Flow

1. User logs in with email and password
2. Backend validates credentials and returns JWT token
3. Token is stored in localStorage
4. Axios interceptor automatically adds token to all requests
5. On 401 response, user is redirected to login
6. Context provides authentication state across the app

## Role Permissions

### Super Admin
- ✅ Create, edit, delete Admins
- ✅ View all Users
- ✅ Create, edit, delete Users
- ✅ Access to all features

### Admin
- ✅ View assigned Users
- ✅ Create, edit, delete assigned Users
- ✅ Create, edit, delete personal Notes
- ❌ Cannot manage Admins

### User
- ✅ Create, edit, delete personal Notes
- ❌ Cannot manage other users or admins

## Key Implementation Details

### Authentication Context
Uses React Context API for state management. Provides login/logout functions and authentication state to all components.

### Route Protection
`ProtectedRoute` component wraps routes and checks:
- User authentication status
- Required roles for the route
- Redirects to login if not authenticated
- Redirects to unauthorized if role doesn't match

### API Configuration
Axios instance with:
- Base URL configuration
- Request interceptor for JWT token injection
- Response interceptor for 401 handling

### Search & Pagination
- Real-time search filtering with debounce
- Server-side pagination (10 items per page)
- Previous/Next navigation with disabled states

## Demo Credentials

```
Email: superadmin@example.com
Password: Admin@123
```

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Technology Stack

- **Frontend**: React 18, React Router DOM
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS3

## Security Features

- JWT token validation
- Protected routes with role checking
- Secure token storage in localStorage
- XSS protection via React's templating
- CORS-enabled API communication
- Password hashing on backend
