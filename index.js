// create the express server here
require('dotenv').config();

const PORT = 3000;

const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./api');
const morgan = require('morgan')

app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use((req, res, next) => {
  console.log('BODY LOGGER START');
  console.log(req.body);
  console.log('BODY LOGGER END');
  next();
});

app.use('/api', apiRouter);

const client = require('./db/client');
client.connect();

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
