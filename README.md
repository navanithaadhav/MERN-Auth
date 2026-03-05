# MERN Authentication System

A full-stack authentication system built with MongoDB, Express.js, React, and Node.js featuring email verification and password reset functionality.

## Features

- User Registration & Login
- JWT-based Authentication
- Email Verification with OTP
- Password Reset via Email
- Protected Routes
- Responsive UI with Tailwind CSS
- Docker Support

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Toastify

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- Bcrypt.js
- Nodemailer (Brevo SMTP)

## Project Structure

```
MERN-Auth/
├── client1/                 # React Frontend
│   ├── src/
│   │   ├── assets/         # Images and icons
│   │   ├── component/      # Reusable components
│   │   │   ├── Header.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/        # React Context
│   │   │   └── AppContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Emailverify.jsx
│   │   │   └── Resetpassword.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── server/                  # Node.js Backend
│   ├── config/
│   │   ├── mongodb.js      # Database connection
│   │   ├── nodemailer.js   # Email configuration
│   │   └── emailTemplates.js
│   ├── controllers/
│   │   ├── authuControllers.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── userAuth.js     # JWT verification
│   ├── models/
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Brevo (Sendinblue) SMTP account for emails

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/navanithaadhav/MERN-Auth.git
   cd MERN-Auth
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

   Create `.env` file in server folder:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   SMTP_USER=your_brevo_smtp_user
   SMTP_PASS=your_brevo_smtp_password
   SENDER_EMAIL=your_sender_email@example.com
   ```

3. **Setup Frontend**
   ```bash
   cd client1
   npm install
   ```

   Create `.env` file in client1 folder:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   ```

### Running the Application

**Development Mode:**

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend (in a new terminal):
```bash
cd client1
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Using Docker

```bash
docker-compose up --build
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/logout` | Logout user | No |
| GET | `/is-auth` | Check authentication | Yes |
| POST | `/send-verify-otp` | Send email verification OTP | Yes |
| POST | `/verify-account` | Verify email with OTP | Yes |
| POST | `/send-reset-otp` | Send password reset OTP | No |
| POST | `/reset-password` | Reset password with OTP | No |

### User Routes (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/data` | Get user data | Yes |

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `NODE_ENV` | Environment (development/production) |
| `SMTP_USER` | Brevo SMTP username |
| `SMTP_PASS` | Brevo SMTP password |
| `SENDER_EMAIL` | Email address for sending emails |

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Backend API URL |

## Deployment

### Render (Recommended)

1. Create a new Web Service for backend
2. Create a new Static Site for frontend
3. Add environment variables in Render dashboard

### Vercel + Railway

- Deploy frontend on Vercel
- Deploy backend on Railway

## Author

**Navanitha**

## License

This project is open source and available under the [MIT License](LICENSE).
