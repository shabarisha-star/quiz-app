# Use official Java runtime as base image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy Maven executable and pom.xml
COPY Backend/quizapp/mvnw .
COPY Backend/quizapp/.mvn ./.mvn
COPY Backend/quizapp/pom.xml .

# Make Maven executable
RUN chmod +x mvnw

# Copy application source
COPY Backend/quizapp/src ./src

# Build application
RUN ./mvnw clean package -DskipTests

# Extract JAR and expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "target/quizapp-0.0.1-SNAPSHOT.jar"]
