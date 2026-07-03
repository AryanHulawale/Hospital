# Hospital Management System

A full-stack web application for managing hospital operations, including patient records, doctor management, and appointment scheduling, built with a client-server architecture.

## About

The Hospital Management System is designed to streamline hospital administration by digitizing key processes such as patient registration, doctor management, and appointment booking. The project follows a clean separation between frontend (`client`) and backend (`server`).

## Project Structure

```
Hospital/
├── client/
│   ├── public/
│   ├── src/
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── Doctor.js
│   │   ├── Patient.js
│   │   └── User.js
│   ├── routes/
│   ├── package.json
│   └── server.js
│
└── README.md
```

## Tech Stack

- Frontend: React (built with Vite) - `client/`
- Backend: Node.js / Express - `server/`
- Database: MongoDB with Mongoose (based on model structure)

## Data Models

- User - authentication and account management
- Doctor - doctor profiles and details
- Patient - patient records
- Appointment - scheduling and booking between patients and doctors

## Features

- Patient registration and record management
- Doctor management
- Appointment scheduling
- Role-based access via middleware
- RESTful API powering the client application

## Getting Started

Clone the repository:

```bash
git clone https://github.com/AryanHulawale/Hospital.git
cd Hospital
```

### Backend Setup

```bash
cd server
npm install
npm start
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Make sure to configure any required environment variables (database URI, API port, JWT secret, etc.) before running the server.

## Purpose

Built as a practical project to apply full-stack development skills to a real-world use case: managing hospital data and workflows through a modern web application.

## License

This project is open for educational and personal use.
