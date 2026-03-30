# Architecture & Implementation Guide

## Overview

This is a complete role-based access control (RBAC) system with a React + Vite frontend and Node.js/Express backend.

## Role Hierarchy

### 1. Super Admin
- Full system access
- Can create and manage Admin accounts
- Can create and manage User accounts
- Exclusive access to `/admins` route

### 2. Admin
- Can manage User accounts (create, edit, delete)
- Can create personal notes
- Cannot manage Admin accounts
- Access to `/users` and `/notes` routes

### 3. User
- Can only create and manage personal notes
- Access to `/notes` route
- No access to user/admin management

## Frontend Architecture

### Authentication Flow

```
Login Form
    ↓
axiosInstance.post('/auth/login')
    ↓
Validate credentials (backend)
    ↓
Return JWT token + user data
    ↓
Store in localStorage
    ↓
Update AuthContext
    ↓
Redirect to Dashboard
```

### Component Hierarchy

```
App
├── AuthProvider (Context)
├── BrowserRouter
└── Routes
    ├── /login → Login Page
    ├── /dashboard → ProtectedRoute → Dashboard
    ├── /admins → ProtectedRoute (super_admin) → Admins
    ├── /users → ProtectedRoute (super_admin, admin) → Users
    ├── /notes → ProtectedRoute (admin, user) → Notes
    └── /unauthorized → Unauthorized
```

### Protected Route Logic

```javascript
ProtectedRoute checks:
1. Is user authenticated? (token in localStorage)
   → No: Redirect to /login
2. Does user have required role?
   → No: Redirect to /unauthorized
3. Yes: Render component
```

## API Integration

### Authentication Endpoint

**POST** `/api/auth/login`
```json
Request: {
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Admins CRUD

**POST** `/api/admins` (Super Admin only)
- Create new admin
- Required fields: name, email, phone, password

**GET** `/api/admins?page=1&limit=10&search=query` (Super Admin only)
- Fetch paginated admins list
- Supports search by name/email
- Returns: { admins: [], total, page, totalPages }

**PUT** `/api/admins/:id` (Super Admin only)
- Update admin details
- Fields: name, email, phone, password (all optional)

**DELETE** `/api/admins/:id` (Super Admin only)
- Delete admin account

### Users CRUD

**POST** `/api/users` (Super Admin, Admin)
- Create new user
- Required fields: name, email, phone, password
- Role defaults to 'user'

**GET** `/api/users?page=1&limit=10&search=query` (Super Admin, Admin)
- Super Admin sees all users
- Admin sees only their created users
- Supports search by name/email

**PUT** `/api/users/:id` (Super Admin, Admin)
- Update user details
- Super Admin can update any user
- Admin can update only their users

**DELETE** `/api/users/:id` (Super Admin, Admin)
- Delete user account

### Notes CRUD

**POST** `/api/notes` (Admin, User)
- Create note
- Required fields: title, content
- Automatically assigned to current user

**GET** `/api/notes?page=1&limit=10&search=query` (Admin, User)
- Fetch user's notes with pagination
- Supports search in title/content
- Users only see their own notes

**PUT** `/api/notes/:id` (Admin, User)
- Update note (only if user owns it)
- Fields: title, content (optional)

**DELETE** `/api/notes/:id` (Admin, User)
- Delete note (only if user owns it)

## State Management

### AuthContext

```javascript
{
  user: {
    id: string,
    name: string,
    email: string,
    role: 'super_admin' | 'admin' | 'user'
  },
  login: (email, password) => Promise,
  logout: () => void,
  loading: boolean,
  error: string | null
}
```

### Local Storage

```javascript
localStorage.getItem('token')     // JWT token
localStorage.getItem('user')      // User object (stringified)
```

## Axios Interceptors

### Request Interceptor
- Extracts token from localStorage
- Adds `Authorization: Bearer <token>` header to all requests
- Only applies if token exists

### Response Interceptor
- Catches 401 Unauthorized responses
- Clears localStorage
- Redirects to /login

## Component Communication

### useAuth Hook

Used in all protected components to access:
- Current user data
- Login function
- Logout function
- Loading and error states

Example:
```javascript
const { user, logout } = useAuth()
```

## Data Flow for CRUD Operations

### Create Operation
```
Form Submit
    ↓
axios.post(endpoint, formData)
    ↓
Request interceptor adds token
    ↓
Backend validates token & creates resource
    ↓
Response: 201 Created
    ↓
Clear form, hide modal, fetch updated list
    ↓
Display success message
```

### Update Operation
```
Edit button click
    ↓
Populate form with existing data
    ↓
Form Submit
    ↓
axios.put(endpoint/:id, updatedData)
    ↓
Backend validates token & ownership
    ↓
Response: 200 OK
    ↓
Fetch updated list
```

### Delete Operation
```
Delete button click
    ↓
Confirm dialog
    ↓
axios.delete(endpoint/:id)
    ↓
Backend validates token & ownership
    ↓
Response: 200 OK
    ↓
Fetch updated list
    ↓
Display success message
```

## Search & Pagination

### Frontend Implementation
- Search input triggers fetchData with updated parameters
- Page number managed in local state
- Both passed to API as query parameters

### Backend Implementation
- MongoDB regex search on name/email fields
- `$regex` with `$options: 'i'` for case-insensitive search
- `skip()` and `limit()` for pagination
- Returns total count for pagination UI

## Error Handling

### At Each Level

**API Layer (axios)**
- Catches network errors
- Handles 401 (unauthorized)
- Redirects to login on auth failure

**Component Level**
- Try/catch blocks in async operations
- Displays error messages to user
- Maintains form state on error

**Form Validation**
- HTML5 required attributes
- Email format validation
- Empty field checks

## Security Measures

### Frontend
- JWT stored in localStorage (not vulnerable to CSRF for this app)
- Protected routes check authentication
- Sensitive data not logged
- XSS protection via React templating

### Backend
- JWT verification for all protected routes
- Role-based access control middleware
- Password hashing with bcrypt
- Ownership verification before CRUD operations

## CSS Architecture

### Global Styles (index.css)
- Typography, colors, spacing
- Button, input, table base styles
- Container and layout utilities

### Component Styles
- Each component has its CSS file
- Component-specific styling and animations
- Responsive breakpoints at 768px

### Design System
- Color palette:
  - Primary: #2c3e50 (dark blue)
  - Secondary: #3498db (light blue)
  - Success: #27ae60 (green)
  - Error: #e74c3c (red)
  - Neutral: #7f8c8d, #95a5a6, #ecf0f1

## Performance Optimizations

1. **Code Splitting**: Vite automatically handles this
2. **Lazy Loading**: React Router lazy routes (can be added)
3. **Pagination**: Limits data loaded at once
4. **Search Debounce**: Can be added to search input
5. **Memoization**: useCallback for event handlers

## Future Enhancements

1. Add email verification for sign-up
2. Implement password reset flow
3. Add profile editing for current user
4. Implement activity logging
5. Add dark mode theme
6. Export data to CSV/PDF
7. Real-time updates with WebSockets
8. Add role-based API rate limiting
9. Implement audit logs
10. Add two-factor authentication
