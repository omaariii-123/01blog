# 01Blog  Documentation

# Frontend Documentation
## Setup & Usage

* **Requirements:** Node.js and npm installed.
* **Installation:** Inside the `frontend` directory, run `npm install` to get the dependencies.
* **Running the app:** Run `npm start`. The app will be available at `http://localhost:4200`.
* **Backend Connection:** The app uses `proxy.conf.json` to route API requests to your local Spring Boot server to prevent CORS errors during development.

## Core Architecture

* **Standalone Components:** The app uses modern Angular features. There are no modules. Every component directly imports what it needs.
* **Routing:** Handled in `app.routes.ts`. It uses functional route guards to protect pages so only logged-in users can access them.
* **State & Services:** Dependency injection is used via the `inject()` function to bring services into components.

## Authentication

* **Login/Register:** When a user logs in, the backend sends back a JWT. The frontend saves this token in local storage.
* **Auth Interceptor:** An HTTP Interceptor automatically adds the `Authorization: Bearer <token>` header to every request sent to the backend. If the token expires, the interceptor catches the 401 error and redirects the user to login.

## Main Features

* **Auth Pages:** Login and register forms that send credentials to the backend.
* **Home Feed:** Fetches the feed, shows a list of posts, and includes a form to upload a new post with an image.
* **User Profile:** Displays the user's posts, follower counts, and a follow/unfollow button.
* **Interactions:** Buttons on each post to toggle likes and add or delete comments.
* **Admin Dashboard:** A protected route for admins to view users and reports, ban accounts, and hide content.

# Backend Documentation

This is the Spring Boot REST API for the 01Blog platform. It handles user accounts, posts, likes, comments, and admin moderation using Spring Security (JWT) and Spring Data JPA.

## Setup & Usage

* **Requirements:** Java 17+ and Maven. A running database is not required out of the box because it uses an in-memory H2 database for development.
* **Running the app:** Run `Application.java` in your IDE or use the terminal command `./mvnw spring-boot:run`.
* **Default Data:** When the app starts empty, it automatically creates two accounts to test with:
  * Admin: `admin` / `admin123`
  * User: `user` / `user123`
* **Authentication:** Once you log in and get a JWT token, pass it in the `Authorization` header as `Bearer <token>` for all secured endpoints.

## Main API Endpoints

### Auth (`/api/v1/auth`)
* `POST /register`: Create a new user (expects `username`, `password`).
* `POST /authenticate`: Login and get a JWT token.

### Posts (`/api/v1/posts`)
* `GET /`: Get all posts (Admins can see hidden ones).
* `GET /feed`: Get posts from people you follow.
* `GET /user/{username}`: Get a specific user's posts.
* `POST /`: Create a post. Sends `multipart/form-data` with `description` and an optional `file`.
* `PUT /{id}`: Update a post description.
* `DELETE /{id}`: Delete a post.

### Users (`/api/v1/users`)
* `GET /{username}`: Get a basic user profile.
* `POST /{id}/follow`: Follow a user.
* `DELETE /{id}/unfollow`: Unfollow a user.
* `GET /{id}/is-following`: Check if you are following a specific user.
* `GET /suggested`: Get paginated user suggestions.

### Interactions (`/api/v1/interactions`)
* `POST /comments/{postId}`: Add a comment to a post.
* `GET /comments/{postId}`: Get all comments for a post.
* `DELETE /comments/{id}`: Delete a comment (must be the author or an admin).
* `POST /likes/{postId}`: Toggle a like on a post.

### Admin (`/api/v1/admin`)
* `GET /users`: View all users.
* `GET /reports`: View reported content.
* `PUT /users/{id}/ban`: Ban or unban a user.
* `DELETE /posts/{id}`: Delete any post.
* `DELETE /users/{id}/delete`: Delete a user and clean up their follow data.
* `PUT /posts/hide/{id}`: Hide a post from the main feed.
* `PUT /posts/unhide/{id}`: Make a post visible again.
