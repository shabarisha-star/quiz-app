# Deployment Guide

## Overview
This guide covers deploying the Quiz Application to production environments.

## Prerequisites
- Docker & Docker Compose
- Domain name (for production)
- SSL certificate (for HTTPS)
- Cloud provider account (AWS, GCP, Azure, etc.)

## Local Docker Deployment

### 1. Build and Push Docker Images

```bash
# Build images
docker-compose build

# Tag images
docker tag quizapp-backend:latest yourdockerhub/quizapp-backend:v1.0
docker tag quizapp-frontend:latest yourdockerhub/quizapp-frontend:v1.0

# Push to registry
docker push yourdockerhub/quizapp-backend:v1.0
docker push yourdockerhub/quizapp-frontend:v1.0
```

### 2. Deploy with Docker Compose

```bash
# Start services in production mode
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f

# Monitor health
docker-compose ps
```

## AWS Deployment (ECS Fargate)

### 1. Create ECR Repositories

```bash
aws ecr create-repository --repository-name quizapp-backend --region us-east-1
aws ecr create-repository --repository-name quizapp-frontend --region us-east-1
```

### 2. Push Images to ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/quizapp-backend:latest ./Backend/quizapp
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/quizapp-backend:latest
```

### 3. Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name quizapp-cluster --region us-east-1
```

### 4. Create RDS Database

```bash
aws rds create-db-instance \
  --db-instance-identifier quizapp-mysql \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YourSecurePassword \
  --allocated-storage 20 \
  --publicly-accessible false
```

## Kubernetes Deployment

### 1. Create ConfigMap and Secrets

```bash
kubectl create configmap quizapp-config \
  --from-literal=DB_HOST=mysql-service \
  --from-literal=DB_NAME=quizdb

kubectl create secret generic quizapp-secrets \
  --from-literal=DB_PASSWORD=yoursecurepassword \
  --from-literal=JWT_SECRET=yoursecretkey
```

### 2. Apply Kubernetes Manifests

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

## SSL/HTTPS Setup

### 1. Using Let's Encrypt with Certbot

```bash
sudo certbot certonly --standalone -d yourdomain.com
sudo certbot renew --dry-run  # Test auto-renewal
```

### 2. Configure Nginx with SSL

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Rest of config...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Environment Configuration

### Production .env

```env
# Server
SERVER_PORT=8080

# Database (RDS/Managed)
DB_URL=jdbc:mysql://quizapp-mysql.xxxx.us-east-1.rds.amazonaws.com:3306/quizdb
DB_USERNAME=admin
DB_PASSWORD=YourSecurePassword
DDL_AUTO=validate

# JWT
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Logging
logging.level.root=WARN
logging.level.com.quizapp.quizapp=INFO
```

## Monitoring & Logging

### 1. CloudWatch Setup (AWS)

```bash
# Send logs to CloudWatch
aws logs create-log-group --log-group-name /quizapp/backend
aws logs create-log-group --log-group-name /quizapp/frontend
```

### 2. Application Performance Monitoring

```bash
# Using DataDog
DD_AGENT_MAJOR_VERSION=7 DD_API_KEY=xxxx DD_SITE=datadoghq.com \
docker run -d --name dd-agent -v /var/run/docker.sock:/var/run/docker.sock ...
```

## Database Backups

### Automated Daily Backup

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/mysql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD quizdb > \
  $BACKUP_DIR/quizapp_$TIMESTAMP.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/quizapp_$TIMESTAMP.sql s3://quizapp-backups/
```

Add to crontab:
```bash
0 2 * * * /scripts/backup.sh
```

## Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 https://yourdomain.com/api/quiz

# Using JMeter
jmeter -n -t quiz_tests.jmx -l results.jtl
```

## Rollback Strategy

### Blue-Green Deployment

```bash
# Deploy new version (Green)
docker-compose -f docker-compose.green.yml up -d

# Run health checks
curl https://yourdomain.com/api/health

# Switch traffic to Green
# If issues, switch back to Blue (old version)
```

## Scaling

### Horizontal Scaling with Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml quizapp

# Scale service
docker service scale quizapp_backend=3
```

## Security Checklist

- [ ] JWT secret configured securely
- [ ] Database credentials in environment variables
- [ ] HTTPS enabled
- [ ] Firewall rules configured
- [ ] Database backups automated
- [ ] Monitoring and alerting enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] SQL injection prevention validated
- [ ] XSS protection enabled

## Troubleshooting

### High CPU Usage
```bash
# Check container stats
docker stats

# Optimize database queries
EXPLAIN SELECT * FROM result WHERE user_id = ?;
```

### Out of Memory
```bash
# Increase container memory limit
docker run --memory="2g" ...

# Check memory usage
free -h
```

### Connection Pool Issues
```bash
# Check open connections
SHOW PROCESSLIST;

# Adjust pool settings in application.properties
spring.datasource.hikari.maximum-pool-size=30
```

---

For additional support, see [README.md](../README.md)
