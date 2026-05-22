require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB Connection String - Try Atlas first, fallback to local
const CONNECTION_STRING = process.env.MONGODB_URI || "mongodb+srv://akintayoolufunmilola1:D42im8hVPmKweKKW@cluster0.ng3gq.mongodb.net/jafad?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000";

const path = require('path');
const routes = require('./routes');
const bodyparser = require('body-parser');

mongoose.set("strictQuery", false);

// Updated connection without deprecated options
mongoose.connect(CONNECTION_STRING)
    .then(() => console.log('✓ MongoDB Connected Successfully'))
    .catch((err) => {
        console.error('✗ MongoDB Connection Error:', err.message);
        console.error('Please check:');
        console.error('1. Your internet connection');
        console.error('2. MongoDB Atlas cluster is running');
        console.error('3. IP address is whitelisted in MongoDB Atlas');
        console.error('4. Database credentials are correct');
    });

mongoose.connection.on('connected', () => console.log('Mongoose connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
});

app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb", extended: true }));
app.use(cors());
app.use(routes);

app.get('/', (req, res) => {
    res.json({ 
        message: "Welcome to JAFAD College of Nursing Science API",
        status: "running",
        endpoints: "/api/..."
    });
});

app.listen(PORT, () => {
    console.log(`✓ Server is running on port: ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Error handling for unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});