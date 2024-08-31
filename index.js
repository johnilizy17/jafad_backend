require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;
// akintayoolufunmilola1
// D42im8hVPmKweKKW
const CONNECTION_STRING = "mongodb+srv://akintayoolufunmilola1:D42im8hVPmKweKKW@cluster0.ng3gq.mongodb.net/";
const path = require('path');
const routes = require('./routes');
const bodyparser = require('body-parser');

mongoose.set("strictQuery", false);

mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('open', () => console.log('Mongo Running'));
mongoose.connection.on('error', (err) => console.log(err));

app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb" }));
app.use(cors());
app.use(routes);

app.get('/', (req, res) => {
    res.send("this is index route for endpoints, welcome to your JAFAD project endpoints");
});

app.listen(PORT);
console.log('App is running on port:' + PORT);