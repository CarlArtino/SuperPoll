const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// DB Config
require('./config/db');

const app = express();

const poll = require('./routes/poll');
const createPoll = require('./routes/createPoll');
const getPoll = require('./routes/getPoll');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Enable CORS
app.use(cors());

app.use('/poll', poll);

app.use('/createPoll', createPoll);

app.use('/getPoll', getPoll);

const port = 3000;

//start server
app.listen(port, () => console.log(`Server started on port ${port}`));