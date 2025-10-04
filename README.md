📋 OverviewNote: The original task did not mention deploying on Vercel, Supabase, or Render, so deployment has not been done, although it was on the to-do list. All required functionalities listed in the task have been implemented. The project has a stronger focus on the backend than the frontend.✨ FeaturesUser Roles & Capabilities🔧 System Administrator

Add new stores, users, and admin accounts
View comprehensive dashboard with platform statistics
Manage all users and stores with advanced filtering
Access detailed user and store information
Apply filters on listings (name, email, address, role)
Full CRUD operations on all entities
👤 Normal User

Sign up and authenticate on the platform
Update password after login
View all registered stores
Search stores by name and address
Submit ratings (1-5) for stores
Modify submitted ratings
View personal rating history
🏪 Store Owner

Authenticate and manage account
Update password
View store dashboard with analytics
See average store rating
View list of users who rated their store
Access detailed rating breakdowns
Core Functionalities

Authentication & Authorization: JWT-based secure authentication with role-based access control
Store Management: Complete CRUD operations for store entities
Rating System: 1-5 star rating system with modification capabilities
Advanced Filtering: Filter and sort data by multiple parameters
Search: Dynamic search functionality for stores
Form Validation: Comprehensive client and server-side validation
Responsive Design: Mobile-friendly interface built with Tailwind CSS
🛠️ Tech StackBackend

Framework: NestJS
Language: TypeScript
Database: PostgreSQL
ORM: TypeORM
Authentication: JWT (JSON Web Tokens)
Validation: class-validator & class-transformer
Security: bcrypt for password hashing
Frontend

Framework: React 18
Language: TypeScript
Styling: Tailwind CSS
Routing: React Router v6
State Management: Context API
HTTP Client: Axios
Form Handling: Custom validation with real-time feedback
📦 Installation & SetupPrerequisites

Node.js (v16 or higher)
PostgreSQL (v12 or higher)
npm or yarn package manager
1. Clone the Repositorybashgit clone https://github.com/CSroseX/Roxiler-Assignment.git
cd Roxiler-Assignment2. Backend Setupbashcd backend
npm installCreate a .env file in the backend directory:env# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=store_rating_db

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=24h

# Server Configuration
PORT=3000
NODE_ENV=developmentCreate the PostgreSQL database:sqlCREATE DATABASE store_rating_db;Run database migrations:bashnpm run migration:runStart the development server:bashnpm run start:devThe backend API will be available at http://localhost:30003. Frontend Setupbashcd frontend
npm installCreate a .env file in the frontend directory:envREACT_APP_API_URL=http://localhost:3000/apiStart the development server:bashnpm startThe frontend will be available at http://localhost:3000 (or another port if 3000 is occupied)🗄️ Database SchemaUsers Table

id (UUID, Primary Key)
name (VARCHAR, 20-60 characters)
email (VARCHAR, Unique)
password (VARCHAR, Hashed)
address (VARCHAR, Max 400 characters)
role (ENUM: admin, user, store_owner)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
Stores Table

id (UUID, Primary Key)
name (VARCHAR, 20-60 characters)
email (VARCHAR, Unique)
address (VARCHAR, Max 400 characters)
ownerId (UUID, Foreign Key → Users)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
Ratings Table

id (UUID, Primary Key)
userId (UUID, Foreign Key → Users)
storeId (UUID, Foreign Key → Stores)
rating (INTEGER, 1-5)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
Unique Constraint: (userId, storeId)
🔐 Authentication Flow
Admin: Created via database seeding or by existing admins
Store Owner & User: Register through signup page
Login: Single login endpoint for all roles
Authorization: JWT token with role claims
Route Protection: Role-based guards on protected routes
Default Admin Credentials (After Seeding)
Email: admin@platform.com
Password: Admin@123📝 Form Validation Rules
Name: Minimum 20 characters, Maximum 60 characters
Email: Valid email format required
Password: 8-16 characters, must include at least one uppercase letter and one special character
Address: Maximum 400 characters
Rating: Integer between 1-5
🚀 Available ScriptsBackendbash# Development
npm run start:dev          # Start with hot-reload
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build the application
npm run start:prod         # Start production server

# Database
npm run migration:generate # Generate migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Generate coverage report

# Code Quality
npm run lint              # Lint code
npm run format            # Format code with PrettierFrontendbash# Development
npm start                 # Start development server
npm run dev              # Alternative start command

# Production
npm run build            # Create production build
npm run preview          # Preview production build

# Testing
npm test                 # Run tests
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Lint code
npm run format           # Format code📁 Project Structurestore-rating-platform/
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # Users module
│   │   ├── stores/            # Stores module
│   │   ├── ratings/           # Ratings module
│   │   ├── common/            # Shared utilities
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   └── dto/
│   │   └── main.ts
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/        # React components
    │   │   ├── auth/
    │   │   ├── admin/
    │   │   ├── user/
    │   │   └── storeOwner/
    │   ├── context/           # Context providers
    │   ├── services/          # API services
    │   ├── types/             # TypeScript types
    │   ├── utils/             # Utility functions
    │   └── App.tsx
    ├── .env
    └── package.json🔌 API EndpointsAuthentication

POST /auth/signup - Register new user
POST /auth/login - Login
POST /auth/change-password - Update password
Admin Routes

GET /admin/dashboard - Dashboard statistics
POST /admin/users - Create user
GET /admin/users - List users (with filters)
GET /admin/users/:id - User details
GET /admin/stores - List stores (with filters)
POST /admin/stores - Create store
Store Routes

GET /stores - List stores (public)
GET /stores/:id - Store details
Rating Routes

POST /ratings - Submit rating
PUT /ratings/:id - Update rating
GET /ratings/my-ratings - User's ratings
Store Owner Routes

GET /store-owner/dashboard - Store statistics
GET /store-owner/raters - Users who rated
