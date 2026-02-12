const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chat');
const emailRoutes = require('./routes/email');
const reservationRoutes = require('./routes/reservations');
const taskRoutes = require('./routes/tasks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Personal Assistant API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
