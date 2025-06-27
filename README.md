# Iskolar Review Center 🎓

A comprehensive **Full-Stack MERN (MongoDB, Express.js, React, Node.js)** educational platform designed specifically for Mechanical Engineering students preparing for their Board Examinations. This project demonstrates modern web development practices, secure authentication, real-time quiz systems, and cloud-based file management.

![Project Banner](https://img.shields.io/badge/MERN-Stack-00d4aa?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.0-61dafb?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

## 🚀 Live Demo

[to be deployed]

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Key Features Implementation](#-key-features-implementation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization

- **JWT-based Authentication** with secure token management
- **Role-based Access Control** (Admin/Student)
- **Email Verification** system with Nodemailer
- **Password Reset** functionality
- **Protected Routes** with middleware
- **Session Management** with cookies

### 📚 Educational Content Management

- **PDF Document Upload & Storage** using AWS S3
- **Categorized Learning Materials** (Lectures, Notes, References)
- **Subject-based Organization** (MESL, Mathematics, etc.)
- **Real-time PDF Viewer** with React-PDF
- **Search & Filter** functionality

### 🎯 Interactive Quiz System

- **Dynamic Quiz Creation** with multiple question types:
  - Multiple Choice Questions
  - Short Answer Questions
- **Real-time Quiz Evaluation** with instant scoring
- **Quiz Categories**: Terms, Weekly Tests, Take-Home Exams, Pre-board Exams
- **Quiz History** and progress monitoring
- **Time-based Quizzes** with configurable limits

### 👨‍💼 Admin Dashboard

- **User Management** with detailed analytics
- **Content Management** for PDFs and quizzes
- **Quiz Creation Interface** with rich text editor
- **Performance Monitoring** across all users
- **Bulk Operations** for content management

### 👨‍🎓 Student Dashboard

- **Personalized Learning Path**
- **Progress Tracking** with visual indicators
- **Quiz Attempts** with detailed feedback
- **Study Material Access** with search capabilities
- **Performance Analytics**

### 🎨 Modern UI/UX

- **Responsive Design** with Tailwind CSS
- **Chakra UI Components** for consistent design
- **Mobile-First Approach**

## 🛠 Tech Stack

### Frontend

- **React 19.0.0** - Modern React with latest features
- **TypeScript 5.7.2** - Type-safe development
- **Vite 6.1.0** - Fast build tool and dev server
- **Tailwind CSS 4.0.6** - Utility-first CSS framework
- **Chakra UI 2.10.5** - Component library
- **React Router DOM 7.1.5** - Client-side routing
- **Zustand 5.0.3** - State management
- **React Hook Form 7.54.2** - Form handling
- **Zod 3.24.2** - Schema validation
- **React PDF 9.2.1** - PDF viewing capabilities
- **Framer Motion 12.4.3** - Animation library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js 4.21.2** - Web framework
- **MongoDB 6.13.0** - NoSQL database
- **Mongoose 8.10.0** - MongoDB ODM
- **JWT 9.0.2** - Authentication tokens
- **Bcryptjs 2.4.3** - Password hashing
- **Nodemailer 6.10.0** - Email services
- **Multer 2.0.1** - File upload handling
- **AWS SDK 3.832.0** - Cloud storage integration
- **CORS 2.8.5** - Cross-origin resource sharing

### Development Tools

- **ESLint 9.19.0** - Code linting
- **Nodemon 3.1.9** - Development server
- **TypeScript 5.8.3** - Backend type safety

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/TS)    │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       
         │                       │                       
         ▼                       ▼                       
┌─────────────────┐    ┌─────────────────┐    
│   AWS S3        │    │   JWT Auth      │               
│   (File Storage)│    │   (Sessions)    │     
└─────────────────┘    └─────────────────┘    
```

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- AWS S3 Account (for file storage)
- SMTP Email Service (for email verification)

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/asterisktotle/IskolarReviewCenter.git
   cd IskolarReviewCenter/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:

   ```env
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_BUCKET_NAME=your_s3_bucket_name
   AWS_REGION=your_aws_region
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:

   ```env
   VITE_BACKEND_URL=http://localhost:3001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📖 Usage

### For Students

1. **Register/Login** with email verification
2. **Browse Learning Materials** by subject and category
3. **Take Quizzes** and track your progress
4. **View Performance Analytics** and quiz history
5. **Access PDF Materials** for online study

### For Administrators

1. **Manage Users** and view analytics
2. **Upload PDF Materials** with categorization
3. **Create Interactive Quizzes** with multiple question types
4. **Monitor Student Performance** across all assessments
5. **Publish/Unpublish Content** as needed

## 🔌 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout
POST /api/auth/verify-email - Email verification
POST /api/auth/reset-password - Password reset
```

### User Management

```
GET  /api/user/profile      - Get user profile
PUT  /api/user/profile      - Update user profile
GET  /api/user/users-list   - Get all users (Admin)
```

### PDF Management

```
GET    /api/pdf/pdf-lectures     - Get all PDFs
POST   /api/pdf/pdf-lectures     - Upload PDF
DELETE /api/pdf/pdf-lectures/:id - Delete PDF
```

### Quiz System

```
POST   /api/quiz/create-quiz        - Create new quiz
GET    /api/quiz/get-all-quizzes    - Get all quizzes
POST   /api/quiz/submit-quiz        - Submit quiz answers
POST   /api/quiz/get-user-quiz-history - Get user quiz history
PUT    /api/quiz/update-quiz/:id    - Update quiz
DELETE /api/quiz/delete-quiz/:id    - Delete quiz
```

## 📁 Project Structure

```
IskolarReviewCenter/
├── backend/                 # Backend API server
│   ├── config/             # Database and email configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   │   ├── Admin/      # Admin-specific pages
│   │   │   └── User/       # User-specific pages
│   │   ├── store/          # Zustand state management
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main application component
│   └── public/             # Static assets
└── pdf_extractor/          # PDF processing utilities
```

## 🔑 Key Features Implementation

### 1. JWT Authentication System

- **Secure token generation** with expiration
- **Refresh token mechanism** for persistent sessions
- **Role-based middleware** for route protection
- **Password encryption** with bcrypt

### 2. AWS S3 Integration

- **Secure file upload** with presigned URLs
- **Automatic file categorization** and metadata
- **CDN integration** for fast content delivery
- **File access control** based on user roles

### 3. Real-time Quiz Engine

- **Dynamic question rendering** with React components
- **Instant evaluation** with detailed feedback
- **Progress tracking** with local storage
- **Timer functionality** for time-limited quizzes

### 4. Responsive Design System

- **Mobile-first approach** with Tailwind CSS
- **Component library** with Chakra UI
- **Smooth animations** with Framer Motion
- **Accessibility features** for inclusive design

### 5. State Management

- **Zustand stores** for global state
- **React Query** for server state management
- **Optimistic updates** for better UX
- **Error boundaries** for graceful error handling

## 📸 Screenshots

[to be added]


## 👨‍💻 Author

Jander Baranda

- GitHub: https://github.com/asterisktotle
- LinkedIn: linkedin.com/in/Jander Baranda
- Email: barandajander@gmail.com

