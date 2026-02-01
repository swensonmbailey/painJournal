
const functions = require('./functions');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

    //get bearerToken each time I make a request in order to make sure
    //that I have an active bearerToken
    let bearerToken = await functions.getBearerToken();
    // console.log(bearerToken);

    //make request to see if person associated with a contact.
    let client = await functions.getClientByPhone(bearerToken, req.body.phone);

    console.log(client);

    //make request to see if person has an active project
    let project = await functions.getProjectByNumber(bearerToken, req.body.projectNum);

    console.log(project);

    let isValidated = functions.validateClientWithProject(client, project);

    if (isValidated){
        res.send(project.clientName + " welcome to LeVar Law's Pain Journal.");

    }else{
        res.send("invalid.");
    }
    
});

module.exports = router;