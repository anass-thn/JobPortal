# Job Portal Backend

Backend API structure for the Job Portal application.

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   ├── errorHandler.js     # Global error handling middleware
│   └── validation.js        # Input validation middleware
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── users.js            # User management routes
│   ├── jobs.js             # Job management routes
│   └── applications.js      # Application management routes
├── models/                  # Database models (to be created)
├── utils/                   # Utility functions (to be created)
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
├── .env.example           # Environment variables template
└── .gitignore             # Git ignore file
```

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment setup:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration values.

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Run the server:**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/auth/test` - Test auth routes
- `GET /api/users/test` - Test user routes
- `GET /api/jobs/test` - Test job routes
- `GET /api/applications/test` - Test application routes

## Next Steps

1. Create database models
2. Implement authentication
3. Add user management
4. Implement job CRUD operations
5. Add application system
6. Add file upload functionality
7. Add email notifications
8. Add search and filtering
9. Add testing
10. Add documentation
