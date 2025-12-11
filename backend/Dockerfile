# Build stage
FROM docker.io/eclipse-temurin:25-jdk AS build

WORKDIR /app

# Copy maven wrapper and pom
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Resolve dependencies (go offline to cache)
RUN ./mvnw dependency:go-offline

# Copy source
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Run stage
FROM docker.io/eclipse-temurin:25-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
