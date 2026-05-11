# Internship Tracker

Internship Tracker is a backend project built with Node.js, Express, MongoDB, Docker, and JWT authentication. It helps users manage internship application records through secure authentication and full CRUD operations. The project also includes CI automation with GitHub Actions and monitoring/log aggregation with Grafana and Loki.

## Current Project Status

This project now includes the backend plus a simple React frontend for class demos.  
The frontend shows the main workflow: register, login, add applications, view applications, update status, and delete applications.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Docker
- Docker Compose
- JWT Authentication
- React
- Vite
- Postman
- GitHub Actions
- Grafana
- Loki

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

### Frontend Demo
- Register and login forms
- JWT stored in browser localStorage after login
- Dashboard with application status counts
- Add application form
- Application list with status filter
- Update status from the list
- Delete application button
- Logout button

### Engineering / DevOps Features
- MongoDB containerized with Docker
- Backend and MongoDB managed with Docker Compose
- GitHub Actions CI workflow for automated testing
- Grafana for monitoring
- Loki for log aggregation
- Backend logs viewable in Grafana Explore

## Project Structure

```text
internship-tracker-project/
├── .github/
│   └── workflows/
│       └── workflow.yml
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── tests/
│   │   └── jwt.test.js
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── docker-compose.yml
└── README.md
```

## Environment Variables

Create a `.env` file inside the `backend` folder based on `.env.example`.

Example:

```env
PORT=5000
MONGODB_URL=mongodb://mongo:27017/internship_tracker
JWT_SECRET=your_jwt_secret_here
FRONTEND_ORIGIN=http://localhost:3000
```

## How to Run Locally

### 1. Start the full stack with Docker Compose

```bash
docker compose up --build
```

### 2. Backend API

The backend runs at:
```text
http://localhost:5000
```

### 3. Frontend UI

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend is configured to prefer:

```text
http://localhost:3000
```

The backend uses `FRONTEND_ORIGIN` for CORS, so make sure `backend/.env` includes:

```env
FRONTEND_ORIGIN=http://localhost:3000
```

If port `3000` is already being used by Grafana, either stop Grafana while presenting the frontend or run the frontend on another port and update `FRONTEND_ORIGIN` to match that URL.

### 4. Grafana

Grafana runs at:
```text
http://localhost:3001
```

Default login:
```text
Username: admin
Password: admin123
```

### 5. Loki

Loki metrics endpoint:
```text
http://localhost:3100/metrics
```

## GitHub Actions

The project includes a GitHub Actions workflow that automatically runs tests when code is pushed to the repository.
Workflow file:
```text
.github/workflows/workflow.yml
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

- API endpoints were tested using Postman.
- A unit test was added with Jest for the JWT utility.
- GitHub Actions automatically runs tests on push.

## Monitoring

- Grafana is used for visualization.
- Loki is used for log aggregation.
- Backend container logs can be queried in Grafana Explore.

## Future Improvements

- Add dashboards for application metrics.
- Add more automated tests.
- Improve monitoring panels in Grafana.

