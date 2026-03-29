const clientFunctions = require('./clientFunctions');
const functions = require('./dashboardFunctions');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {

    //check to see if this case has signned up?
    let databaseInfo = await clientFunctions.getUserDatabaseInfo(req.body.phone, req.body.projectNum);

    console.log(databaseInfo);

    if (!databaseInfo.length > 0) {
            return res.status(401).json({ message: "User never signed up for project: " + req.body.projectNum });
    }

    //get bearerToken each time I make a request in order to make sure
    //that I have an active bearerToken
    let bearerToken = await clientFunctions.getBearerToken();

    //make request to see if person associated with a contact.
    let client = await clientFunctions.getClientByPhone(bearerToken, req.body.phone);

    if (client == null) {return res.status(404).send("invalid credentials");}

    //make request to see if person has an active project
    let project = await clientFunctions.getProjectByNumber(bearerToken, req.body.projectNum);

    if (project == null) {return res.status(404).send("invalid credentials");}

    //isValidated returns an array [boolean, correct contact for project]
    let isValidated = clientFunctions.validateClientWithProject(client, project);

    console.log(isValidated[0]);

    console.log(project.firstPrimaryUsername);

    let attorneyValidated = isValidated[0] && (project.firstPrimaryUsername == req.body.username);

    console.log(attorneyValidated);

    if (attorneyValidated){
        //case credentials and employee are authenticated
        return clientFunctions.createJWT(req.body.projectNum, res);

    }else{
        return res.status(403).send("invalid credentials");
    }
    
});

router.get('/entries', clientFunctions.authenticateToken, async (req, res) => {
    await functions.getLastEntry(req, res);
});

module.exports = router; 