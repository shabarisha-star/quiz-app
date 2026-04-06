# Quiz Application

A modern full-stack quiz application with real-time quiz management, leaderboards, and comprehensive user statistics.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- **User Authentication**: Secure JWT-based authentication
- **Quiz Management**: Create, edit, delete, and manage quizzes (Admin)
- **Quiz Submission**: Users can take quizzes and submit answers
- **Scoring**: Automatic scoring with real-time feedback
- **Leaderboard**: Global leaderboard showing top performers
- **User Statistics**: Comprehensive user stats including:
  - Total quizzes taken
  - Average score
  - Best score
  - Category-wise performance
  - Recent results
- **Admin Dashboard**: Manage quizzes and monitor platform
- **User Profile**: View personal stats and history
- **Dark Mode**: Theme toggle for better UX
- **Role-based Access Control**: Admin and User roles

### Technical Features
- ✅ RESTful API with Spring Boot
- ✅ JWT Authentication & Authorization
- ✅ MySQL Database with JPA/Hibernate
- ✅ React 19 with Vite
- ✅ Tailwind CSS for styling
- ✅ Docker & Docker Compose support
- ✅ CORS configured
- ✅ Error handling and validation
- ✅ Responsive design

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 4.1.0
- **Language**: Java 21
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security
- **ORM**: Hibernate with JPA
- **Build**: Maven
- **Libraries**: 
  - Lombok (reduce boilerplate)
  - Jakarta Validation API
  - MySQL Connector

### Frontend
- **Framework**: React 19.2.4
- **Build Tool**: Vite 8.0.1
- **Styling**: Tailwind CSS 4.x
- **HTTP Client**: Axios
- **UI Components**: Lucide React (icons)
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Server**: Nginx (production)

## 📁 Project Structure

```
Project.V2/
├── Backend/
│   └── quizapp/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/quizapp/quizapp/
│       │   │   │   ├── controller/        # API endpoints
│       │   │   │   ├── service/           # Business logic
│       │   │   │   ├── repository/        # Data access
│       │   │   │   ├── entity/            # JPA entities
│       │   │   │   ├── dto/               # Data transfer objects
│       │   │   │   ├── exception/         # Custom exceptions
│       │   │   │   └── security/          # JWT & security config
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       ├── pom.xml                        # Maven dependencies
│       ├── Dockerfile
│       └── .dockerignore
├── quiz-frontend/
│   ├── src/
│   │   ├── components/                    # React components
│   │   ├── api/                           # API client
│   │   ├── App.jsx                        # Main app
│   │   ├── main.jsx                       # Entry point
│   │   └── index.css                      # Global styles
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── docker-compose.yml
├── .env.example
└── README.md
```

## 📋 Prerequisites

### Local Development
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Java**: JDK 21 or higher
- **Maven**: 3.8.1 or higher
- **MySQL**: 8.0 or higher

### Docker
- **Docker**: 20.10 or higher
- **Docker Compose**: 2.10 or higher

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Project.V2
```

### 2. Backend Setup

```bash
cd Backend/quizapp

# Configure environment variables
cp ../../.env.example .env
# Edit .env with your database credentials

# Build the project
./mvnw clean install

# Or on Windows
mvnw.cmd clean install
```

### 3. Frontend Setup

```bash
cd quiz-frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API base URL
```

## 🏃 Running the Application

### Option 1: Local Development

#### Start MySQL Database
```bash
# Using Docker
docker run --name quiz-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=quizdb -p 3306:3306 -d mysql:8.0

# Or use existing MySQL installation
# Ensure database 'quizdb' exists
```

#### Start Backend
```bash
cd Backend/quizapp
./mvnw spring-boot:run
# Backend runs on: http://localhost:8080/api
```

#### Start Frontend (in new terminal)
```bash
cd quiz-frontend
npm run dev
# Frontend runs on: http://localhost:5173
```

### Option 2: Docker Compose (Recommended for Production)

```bash
# Navigate to project root
cd Project.V2

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (cleanup)
docker-compose down -v
```

**Access Points**:
- Frontend: http://localhost
- Backend API: http://localhost/api
- MySQL: localhost:3306

## 🐳 Docker Setup

### Build Images Individually

```bash
# Backend
cd Backend/quizapp
docker build -t quizapp-backend:latest .

# Frontend
cd quiz-frontend
docker build -t quizapp-frontend:latest .

# MySQL
docker run -d --name quiz-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=quizdb \
  -p 3306:3306 \
  mysql:8.0
```

### Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View service status
docker-compose ps

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "username": "john_doe",
  "role": "USER"
}
```

### Quiz Endpoints

#### Get All Quizzes
```http
GET /api/quiz?category=Programming&search=JavaScript
Authorization: Bearer {token}
```

#### Get Quiz by ID
```http
GET /api/quiz/{id}
Authorization: Bearer {token}
```

#### Create Quiz (Admin Only)
```http
POST /api/quiz
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "JavaScript Basics",
  "category": "Programming",
  "questions": [
    {
      "question": "What is a closure?",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": 0
    }
  ]
}
```

#### Update Quiz (Admin Only)
```http
PUT /api/quiz/{id}
Authorization: Bearer {token}
```

#### Delete Quiz (Admin Only)
```http
DELETE /api/quiz/{id}
Authorization: Bearer {token}
```

#### Submit Quiz
```http
POST /api/quiz/{id}/submit
Content-Type: application/json
Authorization: Bearer {token}

{
  "answers": [0, 1, 2, 3]
}
```

### Results Endpoints

#### Get User Results
```http
GET /api/results/user
Authorization: Bearer {token}
```

#### Get Leaderboard
```http
GET /api/results/leaderboard
Authorization: Bearer {token}
```

#### Get User Statistics
```http
GET /api/results/user/stats
Authorization: Bearer {token}
```

**Response**:
```json
{
  "totalQuizzes": 25,
  "averageScore": 78.5,
  "bestScore": 95,
  "averageTime": 480.5,
  "recentResults": [...],
  "categoryStats": [...]
}
```

## 🔐 Environment Variables

### Backend (.env)
```properties
# Server
SERVER_PORT=8080

# Database
DB_URL=jdbc:mysql://localhost:3306/quizdb
DB_USERNAME=root
DB_PASSWORD=root
DDL_AUTO=update

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🧪 Testing

### Backend Tests
```bash
cd Backend/quizapp
./mvnw test
```

### Frontend Tests
```bash
cd quiz-frontend
npm test
```

## 🔄 Development Workflow

### Backend Development
1. Create feature branch: `git checkout -b feature/quiz-analytics`
2. Make changes in `Backend/quizapp/src/main/java`
3. Run tests: `./mvnw test`
4. Build: `./mvnw clean install`
5. Commit and push
6. Create Pull Request

### Frontend Development
1. Create feature branch: `git checkout -b feature/advanced-filters`
2. Make changes in `quiz-frontend/src`
3. Run dev server: `npm run dev`
4. Build: `npm run build`
5. Preview: `npm run preview`
6. Commit and push
7. Create Pull Request

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
docker ps | grep mysql

# Reset database
docker-compose down -v
docker-compose up -d mysql
```

### Port Already in Use
```bash
# Find process using port
lsof -i :8080     # Backend
lsof -i :5173     # Frontend
lsof -i :3306     # MySQL

# Kill process
kill -9 <PID>
```

### JWT Token Expired
- Clear browser localStorage
- Re-login to get new token

### CORS Errors
- Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Check browser developer tools for exact error

## 📈 Performance Optimization

- Database query optimization with proper indexing
- Frontend code splitting with Vite
- Caching strategies for API responses
- Connection pooling with HikariCP
- Gzip compression in Nginx

## 🚀 Deployment

### Deploy to AWS/GCP/Azure
1. Push Docker images to container registry
2. Set up managed database (RDS/Cloud SQL)
3. Deploy containers using:
   - Docker Swarm
   - Kubernetes
   - ECS/GKE/AKS

### Environment-Specific Configuration
- Development: `.env.development`
- Production: `.env.production`

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE.md for details

## 👥 Support

For issues and questions:
- Open an issue on GitHub
- Contact: support@quizapp.com
- Documentation: [Wiki](./wiki)

---

**Last Updated**: April 2026
**Version**: 2.0.0
