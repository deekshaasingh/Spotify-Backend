const express = require('express');
const authRoutes = require('./routers/auth.router');
const musicRoutes = require('./routers/music.router');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/', authRoutes);
app.use('/api/music/', musicRoutes);

module.exports = app;