const functions = require('./clientFunctions');
const express = require('express');
const router = express.Router();

router.get('/', functions.authenticateToken, async (req, res) => {
    res.send('in dashboard');
});

module.exports = router;