# Knightly Backend Foundation

Knightly is an AI-powered humanized chess review and analytics platform focused on helping beginner and intermediate chess players understand their mistakes through natural coaching-style explanations.

This repository contains the backend foundation for the Knightly platform.

## Current Architecture (PR 1)

This initial PR sets up the professional and scalable architecture for the backend.

- **Framework**: Node.js & Express.js
- **Security**: Helmet & CORS
- **Logging**: Morgan
- **Environment Management**: Dotenv
- **Routing**: Centralized routing system with versioning (`/api/v1`)

### Project Structure

```text
src/
├── config/        # Configuration files
├── routes/        # API Routes
│   └── index.js   # Centralized route index
├── app.js         # Express app initialization
└── server.js      # Server entry point
```

## Features Implemented

- [x] Express server setup
- [x] Global middleware configuration (Helmet, CORS, Morgan, JSON parsing)
- [x] Professional project structure (app vs server separation)
- [x] Environment variable configuration
- [x] Health check API endpoint (`/api/v1/health`)
- [x] Centralized routing system

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

### Available Scripts

- `npm start`: Runs the server in production mode.
- `npm run dev`: Runs the server in development mode with nodemon.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Check if the backend is running |
