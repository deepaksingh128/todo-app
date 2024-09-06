const express = require('express');
const cors = require('cors');
const userRoutes = require('../src/routes/userRoutes');
const todoRoutes = require('../src/routes/todoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

module.exports = app;