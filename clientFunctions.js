const pool = require('./db');
require('dotenv').config();
const jwt = require('jsonwebtoken');


async function getBearerToken() {
    const axios = require('axios');
    const qs = require('qs');

    const data = qs.stringify({
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        grant_type: 'personal_access_token',
        scope: 'fv.api.gateway.access tenant filevine.v2.api.* email openid fv.auth.tenant.read',
        token: process.env.token
    });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://identity.filevine.com/connect/token',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data
    };

    try {
        const response = await axios.request(config);
        return response.data.access_token;
    } catch (err) {
        console.error('bearer token error');
        throw err;
    }
}


async function getClientByPhone(bearer, phone){
        const axios = require('axios');
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.filevineapp.com/fv-app/v2/Contacts?phone=${phone}`,
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + bearer,
                'x-fv-orgid': process.env.FILEVINE_ORGID,
                'x-fv-userid': process.env.FILEVINE_USERID
            }
        };

        try {
            const response = await axios.request(config);
            return response.data;   // <-- THIS is the important part
        } catch (error) {
            console.log('error in getClientByPhone');
            return null;
        }

}

async function getClientByEmail(bearer, email){
        const axios = require('axios');
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.filevineapp.com/fv-app/v2/Contacts?email=${email}`,
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + bearer,
                'x-fv-orgid': process.env.FILEVINE_ORGID,
                'x-fv-userid': process.env.FILEVINE_USERID
            }
        };

        try {
            const response = await axios.request(config);
            console.log(response.data);
            return response.data;   
        } catch (error) {
            console.error(error);
            throw error;
        }

}

async function getProjectByNumber(bearer, projectNumber){
    const axios = require('axios').default;

    const options = {
    method: 'GET',
    url: 'https://api.filevineapp.com/fv-app/v2/Projects/'+projectNumber,
    headers: {
        'x-fv-orgid': process.env.FILEVINE_ORGID,
        'x-fv-userid': process.env.FILEVINE_USERID,
        Accept: 'application/json',
        Authorization: 'Bearer '+ bearer
    }
    };

    try {
    const { data } = await axios.request(options);
    // console.log(data);
    return data;
    } catch (error) {
    console.log("error in getProjectByNumber");
    return null;
    }
}

function validateClientWithProject(client, project){

    let clientInProject = project.clientId.native;
    let isValidated = false;
    let clientContact;

    client.items.forEach(contact => {
        // console.log(contact.personId.native);
        if (contact.personId.native == clientInProject){
            isValidated = true;
            clientContact = contact;
        }
        
    });

    return [isValidated, clientContact];
}

function createJWT(projectNum, res){
    const accessToken = jwt.sign(projectNum, process.env.ACCESS_TOKEN_SECRET);
    return res.json({accessToken: accessToken});
}

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, projectNum) => {
        if(err) return res.sendStatus(403);
        console.log(projectNum);
        req.projectNum = projectNum;
        next();
    });
}

async function getUserDatabaseInfo(phone, projectNum){
    const [rows] = await pool.query(
            `SELECT *
            FROM contacts
            JOIN projects ON contacts.id = projects.contactId
            WHERE contacts.phone = ? AND projects.id = ?`,
            [phone, projectNum]
        );

        // if (rows.length === 0) {
        //     return res.status(404).json({ message: "No projects found for this contact" });
        // }

        console.log(rows);
        return rows;


}

async function createDatabaseRecord(phone, projectNum, client, project, res){
    //check to see if client already exists in the database

    // console.log("_______________________");
    // console.log(client);
    // console.log("_______________________");

    let contactId = client.personId.native;
    let phaseName = project.phaseName;
    let attorneyName = project.firstPrimaryName;
    let attorneyUsername = project.firstPrimaryUsername;

    //rows possible will return multiple contacts with the same number, 
    // but different names like
    const [rows] = await pool.query(
        `SELECT *
        FROM contacts
        WHERE contacts.phone = ?`,
        [phone]
    );

    let sameContactId = false;
    rows.forEach(contact => {
        if (contact.id == contactId){
            sameContactId = true;
        }
    });

    if (rows.length === 0 || !sameContactId) {
        //create the client as per the validate contact that corresponds to the project
        let firstName = client.firstName;
        let lastName = client.lastName;

        console.log(firstName, lastName);
        

        try {
            const [result] = await pool.query(
                `INSERT INTO contacts (id, firstName, lastName, phone)
                VALUES (?, ?, ?, ?)`,
                [contactId, firstName, lastName, phone]
            );
            console.log(result);
        } catch (err) {
            return res.status(500).json({ error: "error in Insert contact" });
            console.log(err);
        }

    }

    //a new project will always be created. a contact can have multiple projects.


    try {
        const [result] = await pool.query(
            `INSERT INTO projects (id, contactId, phaseName, attorneyName, attorneyUsername)
            VALUES (?, ?, ?, ?, ?)`,
            [projectNum, contactId, phaseName, attorneyName, attorneyUsername]
        );
        console.log(result);
    } catch (err) {
        return res.status(500).json({ error: "error in Insert contact" });
        console.log(err);
    }


}   

module.exports = { getBearerToken, getClientByPhone, getProjectByNumber, validateClientWithProject, 
    authenticateToken, createDatabaseRecord, createJWT, getUserDatabaseInfo
 };