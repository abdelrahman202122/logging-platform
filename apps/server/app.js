const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { notFoundHandler } = require('./middleware/notFound.middleware');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
