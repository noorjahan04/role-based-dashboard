const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

/* ✅ Middleware */
app.use(cors());
app.use(express.json());

/* ✅ ROOT ROUTE (VERY IMPORTANT) */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Role-Based Dashboard API is LIVE",
    endpoints: {
      login: "/api/auth/login",
      admins: "/api/admins",
      users: "/api/users",
      notes: "/api/notes"
    }
  });
});

/* ✅ API ROUTES */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));

/* ❌ 404 HANDLER (NEW - VERY IMPORTANT) */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ❌ ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!"
  });
});

/* ✅ SERVER START */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});