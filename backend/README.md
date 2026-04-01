# 01blog Backend

## Project Overview
This is the backend for the 01blog application built using Spring Boot 3.5.0. The application uses PostgreSQL for data storage and JWT for authentication.

## Prerequisites
- Java JDK 17 or later
- Maven 3.6 or later
- PostgreSQL 14 or later
- Docker (for deployment)

## Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/omaariii-123/01blog.git
    cd 01blog/backend
    ```

2. Install dependencies:
    ```bash
    mvn clean install
    ```

3. Create a PostgreSQL database:
    ```sql
    CREATE DATABASE blog_db;
    ```

4. Update application properties:
    Edit `src/main/resources/application.properties` with your database details:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/blog_db
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    ```

## Database Configuration
To configure PostgreSQL:
1. Install PostgreSQL and create a user.
2. Give necessary permissions to the user for the `blog_db` database.

## API Endpoints
### Authentication
- **POST** `/api/auth/login`
  - Request Body: `{ "username": "your_username", "password": "your_password" }`
  
### Blog Posts
- **GET** `/api/posts`
- **POST** `/api/posts`
  - Request Body: `{ "title": "Post Title", "content": "Post Content" }`
  
- **GET** `/api/posts/{id}`
- **PUT** `/api/posts/{id}`
  - Request Body: `{ "title": "Updated Title", "content": "Updated Content" }`
  
- **DELETE** `/api/posts/{id}`

## Docker Deployment
To deploy the application using Docker:
1. Build the Docker image:
    ```bash
    docker build -t blog-backend .
    ```

2. Run the Docker container:
    ```bash
    docker run -p 8080:8080 --env-file .env blog-backend
    ```

## Additional Notes
- Ensure that you have configured JWT secret keys in your application for secure authentication.
- Refer to the official Spring Boot documentation for additional configurations.