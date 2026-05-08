# Internship Tracker

Internship Tracker is a backend project built with Node.js, Express, MongoDB, Docker, and JWT authentication. It helps users manage internship application records through secure authentication and CRUD operations.

## Current Project Status

This is the first backend version of the project.  
The frontend has not been added yet.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Docker
- JWT Authentication
- Postman

## Features Implemented

### Authentication
- User registration
- User login
- JWT-based protected routes

### Internship Application Management
- Create a new application
- Get all applications for the logged-in user
- Update an application
- Delete an application
- Filter applications by status

## Project Structure

```text
internship-tracker-project/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
└── README.md
```

## Environment Variables

Create a `.env` file inside the `backend` folder based on `.env.example`.

Example:

```env
PORT=5000
MONGODB_URL=mongodb://127.0.0.1:27018/internship_tracker
JWT_SECRET=your_jwt_secret_here
FRONTEND_ORIGIN=http://localhost:3000
```

## How to Run Locally

### 1. Start MongoDB with Docker

```bash
docker run -d --name internship-tracker-mongo -p 27018:27017 mongo
```

### 2. Go to the backend folder

```bash
cd backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

## API Endpoints

### Auth

```text
POST /api/auth/register
POST /api/auth/login
```

### Applications

```text
POST /api/applications
GET /api/applications
PUT /api/applications/:id
DELETE /api/applications/:id
GET /api/applications?status=Applied
```

## Testing

The API endpoints were tested using Postman.
