# Backend Structure

This is the backend server for the TU Marketplace application.

## Directory Structure

```
backend/
├── config/         # Configuration files (database, environment variables)
├── controllers/    # Business logic
├── models/         # Database models and schemas
├── routes/         # API route definitions
├── server.js      # Main application file
├── checkData      # Data validation utilities
└── seedData       # Database seeding utilities
```

## Setup

1. Create a `.env` file in the backend directory with:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

2. Install dependencies:

```bash
npm install
```

3. Run the server:

```bash
npm run server
```
