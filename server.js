require('dotenv').config();
const cors = require('cors');
const express = require('express');
const clientRouter = require('./client');
const app = express();

app.use(cors({
    origin: ['http://localhost:5500', 'http://12z.0.0.1:5500']
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello');
});

app.use('/client', clientRouter);

app.listen(3000, () => {
    console.log('up and running')
});