require('dotenv').config();
const functions = require('./clientFunctions');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {

    //check to see if already has signned up? aka if client and project are in the database already.
    //note if this comes back empty client still potentially might have another project in the database
    let databaseInfo = await functions.getUserDatabaseInfo(req.body.phone, req.body.projectNum);

    console.log(databaseInfo);

    if (databaseInfo.length > 0) {
            return res.status(401).json({ message: "You have already signed up for this case." });
    }



    //get bearerToken each time I make a request in order to make sure
    //that I have an active bearerToken
    let bearerToken = await functions.getBearerToken();
    // console.log(bearerToken);

    //make request to see if person associated with a contact.
    let client = await functions.getClientByPhone(bearerToken, req.body.phone);

    if (client == null) {return res.status(404).send("invalid credentials");}

    //make request to see if person has an active project
    let project = await functions.getProjectByNumber(bearerToken, req.body.projectNum);

    if (project == null) {return res.status(404).send("invalid credentials");}

    //isValidated returns an array [boolean, correct contact for project]
    let isValidated = functions.validateClientWithProject(client, project);

    if (isValidated[0]){
        //user is authenticated as a client so make make database for them and JWT for client

        await functions.createDatabaseRecord( req.body.phone, req.body.projectNum, isValidated[1], project, res);

        functions.createJWT(req.body.projectNum, res);

    }else{
        return res.status(403).send("invalid credentials");
    }
    
});

router.post('/login', async (req, res) => {
    //body will have phone and projectNum. If these appear connected in database 
    // then user is authenticated
    let databaseInfo = await functions.getUserDatabaseInfo(req.body.phone, req.body.projectNum);

    console.log(databaseInfo);

    //test to sse if not pre
    if (databaseInfo.length === 0) {
            return res.status(401).send("Credentials failed.");
    }

    functions.createJWT(req.body.projectNum, res);

    
});

router.post('/JWTLogin', functions.authenticateToken, async (req, res) => {
    res.status(200).send("signed in");
});


module.exports = router;