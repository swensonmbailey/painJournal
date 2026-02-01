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
        console.error(err);
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
    console.log(data);
    return data;
    } catch (error) {
    console.error(error);
    }
}

function validateClientWithProject(client, project){

    let clientInProject = project.clientId.native;
    let isValidated = false;

    client.items.forEach(contact => {
        // console.log(contact.personId.native);
        if (contact.personId.native == clientInProject){
            isValidated = true;
        }
        
    });

    return isValidated;
}

module.exports = { getBearerToken, getClientByPhone, getProjectByNumber, validateClientWithProject };