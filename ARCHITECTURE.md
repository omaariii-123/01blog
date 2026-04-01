# Architecture Documentation

## System Overview
This document provides a comprehensive overview of the architecture of the 01blog system. It highlights the key components of the system including frontend, backend, and infrastructure deployment.

## Frontend Architecture
- **Framework**: React.js
- **State Management**: Redux
- **Routing**: React Router
- **Styling**: CSS Modules
- **Build Tool**: Webpack

### Key Components
- **Components**: Reusable UI components that manage their own state.
- **Containers**: Components that connect to Redux for state management.

## Backend Architecture
- **Framework**: Node.js with Express
- **APIs**: RESTful APIs that serve data to the frontend.
- **Middleware**: Functions that process requests before reaching the final route handler.

### Key Components
- **Controllers**: Handle incoming requests and return responses.
- **Models**: Represent data structure and interact with the database.
- **Routes**: Define the endpoints for the application.

## Database Design
- **Database**: MongoDB
- **Collections**: Users, Posts, Comments
- **Data Relationships**: 
  - Users can have multiple Posts.
  - Posts can have multiple Comments.

### Example Document Structure
- **User Document**: 
  ```json
  { "_id": "userId", "username": "user1", "email": "user1@example.com" }
  ```
- **Post Document**: 
  ```json
  { "_id": "postId", "title": "Post Title", "content": "Post content...", "authorId": "userId" }
  ```

## Docker Deployment
- **Dockerfile**: Defines the environment for both frontend and backend.
- **Docker Compose**: Manages multi-container setups for web and database services.

### Commands
- Build: `docker-compose build`
- Start: `docker-compose up`
- Stop: `docker-compose down`

## API Endpoints
| Method | Endpoint          | Description                  |
|--------|-------------------|------------------------------|
| GET    | /api/users        | Retrieve all users           |
| POST   | /api/posts        | Create a new post            |
| GET    | /api/posts/{id}   | Retrieve a specific post      |
| PUT    | /api/posts/{id}   | Update an existing post       |
| DELETE | /api/posts/{id}   | Delete a post                |

## Security
- **Authentication**: JWT-based authentication for API requests.
- **Authorization**: Role-based access control for sensitive routes.
- **Sanitization**: Input validation and sanitization to prevent XSS and SQL injection.

## Development Workflow
1. **Clone the Repository**: `git clone <repo-url>`
2. **Install Dependencies**: `npm install`
3. **Run Application**: `npm start`
4. **Create a New Branch**: `git checkout -b <feature-branch>`
5. **Push Changes**: `git push origin <feature-branch>`
6. **Open Pull Request**: Submit PR for review and merging into `main`.
