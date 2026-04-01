# Project Documentation

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Deployment:** Heroku

## Prerequisites
- Node.js installed
- MongoDB installed or access to a MongoDB cloud instance
- Git installed

## Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/omaariii-123/01blog.git
   cd 01blog
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Database Setup
1. Create a new MongoDB database.
2. Update the `.env` file with your MongoDB connection string.

## Deployment Instructions
To deploy the project on Heroku:
1. Create a new Heroku app:
   ```bash
   heroku create <app-name>
   ```
2. Set the environment variables on Heroku:
   ```bash
   heroku config:set MONGODB_URI=<your-mongo-uri>
   ```
3. Deploy the app:
   ```bash
   git push heroku main
   ```

## Troubleshooting Guide
- If the app fails to start, check that all environment variables are set correctly.
- Ensure that MongoDB is running and accessible.