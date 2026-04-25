# Hotelix Backend API

<p align="center">
  <strong>A comprehensive hotel booking management system built with NestJS, GraphQL, and PostgreSQL</strong>
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Hotelix Backend is a robust GraphQL API server for a hotel booking platform. It manages hotels, rooms, bookings, user authentication, reviews, and subscriptions. Built with [NestJS](https://nestjs.com/), it provides a scalable, type-safe, and well-documented API.

---

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) v11
- **API**: [GraphQL](https://graphql.org/) with Apollo Server
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT with Passport
- **File Upload**: Cloudinary
- **Real-time**: Socket.io
- **Language**: TypeScript
- **Validation**: Class Validator
- **Testing**: Jest

---

## ✨ Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - User roles (GUEST, HOST, ADMIN)
  - Password hashing with bcrypt
  - Token refresh mechanism

- **Hotel Management**
  - CRUD operations for hotels
  - Hotel amenities and descriptions
  - Multi-image support via Cloudinary
  - Hotel ratings and reviews

- **Room Management**
  - Room types and pricing
  - Capacity management
  - Image galleries
  - Room availability tracking

- **Booking System**
  - Booking creation and management
  - Check-in/check-out date validation
  - Price calculation
  - Booking status tracking (PENDING, CONFIRMED, CANCELLED)

- **Review System**
  - Guest reviews with ratings
  - Review moderation
  - Rating aggregation

- **Hotel Subscriptions**
  - User subscription management
  - Personalized hotel notifications

- **Real-time Communication**
  - WebSocket support via Socket.io
  - Real-time notifications

- **File Management**
  - Image upload to Cloudinary
  - Multi-file handling

---

## 📦 Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- PostgreSQL v12 or higher
- Cloudinary account (for image uploads)

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hotelix/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

---

## 🔧 Environment Setup

Create a `.env` file in the server root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/hotelix_db

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=3600

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=3000
NODE_ENV=development
```

---

## 🏃 Running the Application

### Development
```bash
npm run start:dev
```
Runs the application in watch mode with hot-reload.

### Production Build
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

---

## 📊 Database

### Prisma Setup

1. **Push schema to database** (development only)
   ```bash
   npx prisma db push
   ```

2. **Create migrations**
   ```bash
   npx prisma migrate dev --name migration_name
   ```

3. **View database with Prisma Studio**
   ```bash
   npx prisma studio
   ```

### Database Schema

The application includes the following main entities:

- **User**: Authentication and user profiles
- **Hotel**: Hotel listings with owner relationships
- **Room**: Hotel rooms with pricing and capacity
- **Booking**: Guest bookings with status tracking
- **Review**: Guest reviews and ratings
- **HotelSubscription**: User subscriptions to hotels
- **Upload**: File metadata tracking

---

## 📡 API Documentation

### GraphQL Playground

Once the server is running, access the GraphQL playground:
```
http://localhost:3000/graphql
```

### Main Modules

#### Auth Module
- `login(email, password)`: User authentication
- `register(email, password, firstName, lastName)`: User registration
- `refreshToken()`: Token refresh

#### Hotels Module
- Query hotels
- Create/update/delete hotels (owner only)
- Filter by location, city, country

#### Rooms Module
- Create/update/delete rooms
- Get rooms by hotel
- Check availability

#### Bookings Module
- Create bookings
- Update booking status
- Get user bookings

#### Reviews Module
- Create reviews
- Get reviews by hotel
- Aggregate ratings

#### Users Module
- Get user profile
- Update user information
- Get user bookings and reviews

#### Subscriptions Module
- Subscribe to hotels
- Unsubscribe from hotels
- Get subscribed hotels

---

## 📁 Project Structure

```
src/
├── auth/           # Authentication & JWT strategy
├── bookings/       # Booking management
├── gateway/        # WebSocket gateway
├── hotels/         # Hotel CRUD operations
├── prisma/         # Database client setup
├── reviews/        # Review management
├── rooms/          # Room management
├── subscriptions/  # Hotel subscriptions
├── upload/         # File upload handling
├── users/          # User management
├── app.module.ts   # Root module
├── app.service.ts  # Root service
├── app.controller.ts # Root controller
├── main.ts         # Application entry point
└── schema.gql      # Generated GraphQL schema

prisma/
├── schema.prisma   # Database schema definition
└── migrations/     # Migration history
```

---

## 📝 Available Scripts

```bash
# Development
npm run start          # Start application
npm run start:dev      # Start with watch mode
npm run start:debug    # Start with debugger

# Building
npm run build          # Build for production

# Production
npm run start:prod     # Run production build

# Code Quality
npm run lint           # Lint and fix code
npm run format         # Format with Prettier

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:debug     # Run tests with debugger
npm run test:e2e       # Run end-to-end tests
```

---

## 🤝 Contributing

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature
   ```

2. Commit your changes
   ```bash
   git commit -am 'Add new feature'
   ```

3. Push to the branch
   ```bash
   git push origin feature/your-feature
   ```

4. Create a Pull Request

---

## 📄 License

UNLICENSED - Proprietary Software

---

## 📞 Support

For issues, questions, or suggestions, please open an issue in the repository.
