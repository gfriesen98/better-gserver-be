//Package Requirements
require('dotenv').config();
require('./db/db_connect');
// require('./db/db_connect');
const cookieParser = require('cookie-parser');
const express      = require('express');
const cors         = require('cors');

const users        = require('./routes/user');
// const email        = require('./routes/email');

//Definitions
const PORT = 5000;
const app  = express();
// const CORSwhitelist = ['http://localhost:3000', 'http://10.0.0.107:3000'];

//Middleware
app.use(cors({
    origin: 'http://localhost:6969',
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded());

//Routes
app.use('/api', users);
// app.use('/api', email);

//Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
