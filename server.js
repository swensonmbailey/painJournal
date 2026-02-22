require('dotenv').config();
const cors = require('cors');
const express = require('express');
const clientRouter = require('./client');
const dashboardRouter = require('./dashboard');
const app = express();

// app.use(cors({
//     origin: ['http://localhost:5500', 'http://127.0.0.1:5500']
// }));

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello');
});

app.use('/client', clientRouter);

app.use('/dashboard', dashboardRouter);

app.listen(3000, () => {
    console.log('up and running')
});