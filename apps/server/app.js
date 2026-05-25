const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.routes');
const applicationRoutes = require('./routes/application.routes');

const { notFoundHandler } = require('./middleware/notFound.middleware');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Logging Platform API is running',
  });
});

app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
