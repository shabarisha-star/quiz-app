# Quick Reference Guide

## 🚀 Getting Started

### First Time Setup

```bash
# Clone project
git clone <repo-url>
cd Project.V2

# Backend setup
cd Backend/quizapp
./mvnw clean install
cd ../..

# Frontend setup
cd quiz-frontend
npm install
cd ../..

# Create .env files
cp .env.example .env
cp quiz-frontend/.env.example quiz-frontend/.env
```

### Start Development Server

**Terminal 1 - Backend:**
```bash
cd Backend/quizapp
./mvnw spring-boot:run
# Running on http://localhost:8080
```

**Terminal 2 - Frontend:**
```bash
cd quiz-frontend
npm run dev
# Running on http://localhost:5173
```

**Terminal 3 - MySQL:**
```bash
docker run --name quiz-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=quizdb -p 3306:3306 -d mysql:8.0
```

---

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images
docker-compose up --build

# Check service status
docker-compose ps

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

---

## 🔧 Useful Commands

### Backend (Maven)

```bash
cd Backend/quizapp

# Build project
./mvnw clean install

# Run tests
./mvnw test

# Run tests with coverage
./mvnw test jacoco:report

# Run application
./mvnw spring-boot:run

# Build JAR
./mvnw clean package

# Skip tests during build
./mvnw clean install -DskipTests
```

### Frontend (npm)

```bash
cd quiz-frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests (if configured)
npm test
```

---

## 📍 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Web application |
| Backend API | http://localhost:8080/api | REST API |
| Swagger UI | http://localhost:8080/swagger-ui.html | API documentation |
| MySQL | localhost:3306 | Database |
| Docker Frontend | http://localhost | When using docker-compose |

---

## 📝 API Endpoints Quick Ref

### Auth
```
POST   /auth/register       Register user
POST   /auth/login          Login user
```

### Quiz
```
GET    /quiz                Get all quizzes
GET    /quiz/{id}           Get quiz by ID
POST   /quiz                Create quiz (Admin)
PUT    /quiz/{id}           Update quiz (Admin)
DELETE /quiz/{id}           Delete quiz (Admin)
POST   /quiz/{id}/submit    Submit quiz answers
```

### Results
```
GET    /results/user        Get user results
GET    /results/leaderboard Get leaderboard
GET    /results/user/stats  Get user statistics
```

---

## 🔐 Default Credentials

**Admin User** (created automatically):
```
Username: admin
Password: (configured in db/migration/V1__initial_schema.sql)
```

---

## 📁 Key File Locations

```
Backend Files:
- Controllers:     Backend/quizapp/src/main/java/com/quizapp/quizapp/controller/
- Services:        Backend/quizapp/src/main/java/com/quizapp/quizapp/service/
- Entities:        Backend/quizapp/src/main/java/com/quizapp/quizapp/entity/
- DTOs:            Backend/quizapp/src/main/java/com/quizapp/quizapp/dto/
- Config:          Backend/quizapp/src/main/java/com/quizapp/quizapp/config/

Frontend Files:
- Components:      quiz-frontend/src/components/
- API Client:      quiz-frontend/src/api/api.js
- Main App:        quiz-frontend/src/App.jsx
- Styles:          quiz-frontend/src/index.css

Config Files:
- Backend Config:  Backend/quizapp/src/main/resources/application.properties
- Frontend Config: quiz-frontend/.env
```

---

## 🔍 Debugging Tips

### Backend Issues
```bash
# Check logs
docker-compose logs backend

# View database
# Use MySQL client or MySQL Workbench
mysql -h localhost -u root -p quizdb

# Check running processes
lsof -i :8080  # Backend port
```

### Frontend Issues
```bash
# Check console
# Open DevTools (F12)

# Check network tab for API calls
# Verify API_BASE_URL in .env

# Clear browser cache
# Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
```

### Database Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d

# Check database connection
mysql -h localhost -u root -p -e "SELECT VERSION();"
```

---

## 📊 Testing

### Backend Tests
```bash
cd Backend/quizapp
./mvnw test                    # Run all tests
./mvnw test -Dtest=UserTest   # Run specific test
./mvnw test jacoco:report     # Generate coverage report
```

### Frontend Tests
```bash
cd quiz-frontend
npm test                       # Run tests
npm test -- --coverage        # With coverage report
```

---

## 📦 Deployment

### Docker Compose (Development)
```bash
docker-compose -f docker-compose.yml up -d
```

### Docker Compose (Production)
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Scale backend service
docker-compose up -d --scale backend=3
```

### Kubernetes
```bash
# Apply manifests
kubectl apply -f k8s/

# Check deployment
kubectl get pods

# View logs
kubectl logs -f deployment/quizapp-backend
```

---

## 🔄 Common Tasks

### Change Database
Edit `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://your-host:3306/your-db
spring.datasource.username=your-user
spring.datasource.password=your-pass
```

### Update API Base URL
Edit `quiz-frontend/.env`:
```
VITE_API_BASE_URL=http://your-api-url/api
```

### Change JWT Expiration
Edit `application.properties`:
```properties
jwt.expiration=3600000  # 1 hour
```

### Enable Debug Logging
Edit `application.properties`:
```properties
logging.level.com.quizapp.quizapp=DEBUG
logging.level.org.springframework=DEBUG
```

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :8080
# Kill process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check MySQL is running
docker ps | grep mysql

# Test connection
mysql -h localhost -u root -p

# Restart container
docker-compose restart mysql
```

### CORS Errors
```
Add frontend URL to CORS_ALLOWED_ORIGINS in .env:
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://your-domain
```

### Token Expired
- Clear localStorage in browser: `localStorage.clear()`
- Login again
- Get new token automatically

---

## 📚 Documentation Links

- **README**: [README.md](./README.md) - Project overview
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
- **Completion**: [PROJECT_COMPLETION.md](./PROJECT_COMPLETION.md) - What was added

---

## 💡 Pro Tips

1. **Use `.env` files** - Never commit credentials
2. **Check logs first** - `docker-compose logs` is your friend
3. **Use Swagger UI** - Test API endpoints at `/swagger-ui.html`
4. **Database migrations** - Always backup before changes
5. **Code review** - Follow CONTRIBUTING.md for PRs
6. **Performance** - Use DevTools to profile frontend
7. **Security** - Rotate JWT secret in production

---

## 📞 Getting Help

1. Check logs: `docker-compose logs -f service-name`
2. Read documentation: See README.md and DEPLOYMENT.md
3. Check existing issues: GitHub Issues
4. Ask community: Discussions section
5. Contact maintainers: Email in profile

---

**Last Updated**: April 2026
**Version**: 2.0.0
