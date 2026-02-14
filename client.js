require('dotenv').config();
const functions = require('./clientFunctions');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {

    //check to see if already has signned up? aka if client and project are in the database already.
    //note if this comes back empty client still potentially might have another project in the database
    let databaseInfo = await functions.getDashboardInfo(req.body.phone, req.body.projectNum);

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

        const accessToken = jwt.sign(req.body.phone, process.env.ACCESS_TOKEN_SECRET);
        res.json({accessToken: accessToken});

    }else{
        return res.status(403).send("invalid credentials");
    }
    
});

// router.post('/signupEmail', async (req, res) => {

//     //check to see if already has signned up? aka if client and project are in the database already.
//     //note if this comes back empty client still potentially might have another project in the database
//     let databaseInfo = await functions.getDashboardInfo(req.body.email, req.body.projectNum);

//     if (databaseInfo.length > 0) {
//             return res.status(401).json({ message: "You have already signed up for this case." });
//     }



//     //get bearerToken each time I make a request in order to make sure
//     //that I have an active bearerToken
//     let bearerToken = await functions.getBearerToken();
//     // console.log(bearerToken);

//     //make request to see if person associated with a contact.
//     let client = await functions.getClientByEmail(bearerToken, req.body.email);

//     // console.log(client);

//     //make request to see if person has an active project
//     let project = await functions.getProjectByNumber(bearerToken, req.body.projectNum);

//     // console.log(project);

//     //isValidated returns an array [boolean, correct contact for project]
//     let isValidated = functions.validateClientWithProject(client, project);

//     if (isValidated[0]){
//         //user is authenticated as a client so make make database for them and JWT for client
        
//         // console.log(isValidated[1].personId.native);

//         functions.createDatabaseRecord( req.body.phone, req.body.projectNum, isValidated[1], project, res);

//         const accessToken = jwt.sign(req.body.phone, process.env.ACCESS_TOKEN_SECRET);
//         res.json({accessToken: accessToken});

//     }else{
//         res.sendStatus(403).send("invalid.");
//     }
    
// });

router.post('/login', functions.authenticateToken, async (req, res) => {
    res.sendStatus(200);
});


module.exports = router;