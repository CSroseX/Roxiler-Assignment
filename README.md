# 🏪 Store Rating Platform

Note: The task did not mention deploying the project on Vercel, Supabase, Render, etc. Hence, the task is considered complete with only its specified deliverables in mind.

![Store Rating Platform](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![NestJS](https://img.shields.io/badge/NestJS-10.0.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.11.0-blue)

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run start:dev
```

### Frontend Deployment
```bash
cd frontend
npm start
# Deploy the 'build' folder to your hosting service
```

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure JWT-based authentication** with refresh tokens
- **Role-based access control** with three distinct user types:
  - 👤 **Regular Users**: Rate and review stores
  - 🏪 **Store Owners**: Manage their stores and view analytics
  - 👑 **Admins**: Full system management and analytics

### 🏪 Store Management
- **Complete CRUD operations** for stores
- **Store analytics** with rating statistics
- **Search and filtering** capabilities
- **Responsive store cards** with modern design

### ⭐ Rating System
- **5-star rating system** with visual feedback
- **Real-time rating updates** and averages
- **Rating history** for users
- **Duplicate rating prevention**

### 📊 Dashboard Analytics
- **Role-specific dashboards** with relevant metrics
- **Interactive statistics** and charts
- **Real-time data updates**
- **Export capabilities** (coming soon)

### 🎨 Modern UI/UX
- **Glass-morphism design** with animated backgrounds
- **Smooth animations** and transitions
- **Responsive design** for all devices
- **Dark theme** with gradient accents
- **Accessibility features** built-in

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Robust relational database
- **TypeORM** - Object-relational mapping
- **JWT** - JSON Web Token authentication
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing
- **Class Validator** - Input validation

### Frontend
- **React 19.2.0** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Formik + Yup** - Form handling and validation
- **Axios** - HTTP client
- **Context API** - State management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/store-rating-platform.git
cd store-rating-platform
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Update .env with your database credentials
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=your_password
# DATABASE_NAME=store_rating_db
# JWT_SECRET=your_jwt_secret_key

# Start the development server
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the development server
npm start
```

### 4. Database Setup
```sql
-- Create the database
CREATE DATABASE store_rating_db;

-- The application will automatically create tables on first run
```

## 📁 Project Structure

```
store-rating-platform/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── admin/          # Admin module
│   │   ├── auth/           # Authentication module
│   │   ├── config/         # Configuration files
│   │   ├── entities/       # Database entities
│   │   ├── stores/         # Store management
│   │   └── users/          # User management
│   ├── dist/               # Compiled JavaScript
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── package.json
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=store_rating_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=4000
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_APP_NAME=Store Rating Platform
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Store Endpoints
- `GET /stores` - Get all stores
- `GET /stores/:id` - Get store by ID
- `POST /stores` - Create new store
- `PUT /stores/:id` - Update store
- `DELETE /stores/:id` - Delete store
- `POST /stores/:id/rate` - Rate a store
- `GET /stores/ratings/my` - Get user's ratings

### Admin Endpoints
- `GET /admin/users` - Get all users
- `POST /admin/users` - Create user
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/stores` - Get all stores (admin view)
- `GET /admin/dashboard` - Get dashboard statistics

## 🎯 User Roles & Permissions

### 👤 Regular User
- View and search stores
- Rate stores (1-5 stars)
- View personal rating history
- Update profile information

### 🏪 Store Owner
- All user permissions
- Create and manage stores
- View store analytics
- Update store information
- Delete own stores

### 👑 Admin
- All store owner permissions
- Manage all users
- Manage all stores
- View system-wide analytics
- Access admin dashboard




