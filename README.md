# Store Rating Platform

A full-stack application for managing and rating stores, built with NestJS, React, TypeScript, and PostgreSQL.

## Features

- User authentication and authorization
- Role-based access control (Admin, Store Owner, User)
- Store management (CRUD operations)
- Store ratings and reviews
- Dashboard for different user roles

## Tech Stack

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Context API for state management

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/CSroseX/Roxiler-Assignment.git
cd Roxiler-Assignment
```

2. Set up the backend:
```bash
cd backend
npm install
# Create .env file and configure database settings
npm run start:dev
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

4. Configure PostgreSQL database:
- Create a database named 'store_rating_db'
- Update .env file with database credentials

## Environment Variables

### Backend (.env)
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=store_rating_db
JWT_SECRET=your_secret_key
```

## Available Scripts

### Backend
- `npm run start:dev` - Start the development server
- `npm run build` - Build the application
- `npm run start:prod` - Start the production server

### Frontend
- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests