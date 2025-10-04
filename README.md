# 🏪 Store Rating Platform

Note: The task did not mention deploying the project on Vercel, Supabase, Render, etc. Hence, the task is considered complete with only its specified deliverables in mind.

![Store Rating Platform](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![NestJS](https://img.shields.io/badge/NestJS-10.0.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.11.0-blue)

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

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#6366f1) to Purple (#8b5cf6)
- **Secondary**: Pink (#ec4899) to Rose (#f43f5e)
- **Background**: Slate (#0f172a) to Purple (#581c87)
- **Glass Effect**: White with 95% opacity and backdrop blur

### Typography
- **Headings**: Inter, bold weights
- **Body**: Inter, regular weight
- **Code**: JetBrains Mono

### Animations
- **Blob Animation**: Floating background elements
- **Fade In**: Smooth content appearance
- **Slide Up**: Page entrance animations
- **Hover Effects**: Interactive feedback

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm test              # Run tests
npm run test:coverage # Coverage report
```

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the 'build' folder to your hosting service
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📈 Performance Features

- **Lazy Loading** - Components loaded on demand
- **Code Splitting** - Optimized bundle sizes
- **Image Optimization** - Compressed and responsive images
- **Caching** - Intelligent data caching
- **Database Indexing** - Optimized queries

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Server-side validation
- **SQL Injection Prevention** - TypeORM protection
- **CORS Configuration** - Cross-origin security
- **Rate Limiting** - API abuse prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- React team for the powerful UI library
- Tailwind CSS for the utility-first approach
- All contributors and testers

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us at support@storerating.com
- Check our [documentation](https://docs.storerating.com)

---

<div align="center">
  <p>Made with ❤️ by the Store Rating Platform Team</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
