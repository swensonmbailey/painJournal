const clientFunctions = require('./clientFunctions');
const functions = require('./dashboardFunctions');
const express = require('express');
const router = express.Router();

router.get('/', clientFunctions.authenticateToken, async (req, res) => {

    let databaseInfo = await functions.getDashboardInfo(req.projectNum);

    //test to make sure project/client info received
    if (databaseInfo.length === 0) {
            return res.status(404).send("Client info not found.");
    }
    
    return res.json(databaseInfo);
});

//get lastet/most recent entry
router.get('/entry', clientFunctions.authenticateToken, async (req, res) => {
    await functions.getLastEntry(req, res);
});

//update lastest/most recent entry
router.put('/entry', clientFunctions.authenticateToken, async (req, res) => {
    await functions.updateLastEntry(req, res);
});

//create new entry
router.post('/entry', clientFunctions.authenticateToken, async (req, res) => {
    await functions.makeJournalEntry(req, res);
})

module.exports = router;