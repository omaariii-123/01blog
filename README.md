# 01Blog  Documentation

Frontend

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
