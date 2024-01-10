const express = require('express');
const axios = require('axios');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const private_app_token = 'pat-na1-ce0fa870-29f0-42ae-a451-5fdd8da806df';

app.get('/animals', async (req, res) => {
    const Animals = "https://api.hubapi.com/crm/v3/objects/2-22401799/?properties=pet_name&properties=breed&properties=bio";
    const headers = {
        Authorization: `Bearer ${private_app_token}`,
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.get(Animals, { headers });
        console.log('HubSpot Response:', response.data);
        const data = response.data.results.map(result => result.properties);
        console.log('Final Data:', data);  
        res.render('contacts', { title: 'Animals | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/update-cobj', async (req, res) => {
    try {
        const response = await axios.get("https://api.hubapi.com/crm/v3/objects/2-22401799/?properties=pet_name&properties=breed&properties=bio", {
            headers: {
                Authorization: `Bearer ${private_app_token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = response.data.results.map(result => result.properties);

        console.log('Data:', data);

        res.render('update-cobj', { title: 'Update Record | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/update-cobj', async (req, res) => {
    const formData = req.body;
    console.log(formData);

    try {
        const newContact = {
            properties: {
                "pet_name": formData.pet_name,
                "breed": formData.breed,
                "bio": formData.bio
            }
        };

        const createContactURL = 'https://api.hubapi.com/crm/v3/objects/2-22401799';
        
        const headers = {
            Authorization: `Bearer ${private_app_token}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(createContactURL, newContact, { headers });

        // The ID of the new contact can be obtained from the response
        const newContactId = response.data.id;

        res.redirect('/animals');  
    } catch (error) {
        console.error(error);
        res.status(500).send(error.response ? error.response.data : 'Error creating new record in CRM');
    }
});


app.get('/', async (req, res) => {
    try {
        const response = await axios.get("https://api.hubapi.com/crm/v3/objects/2-22401799/?properties=pet_name&properties=breed&properties=bio", {
            headers: {
                Authorization: `Bearer ${private_app_token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = response.data.results.map(result => result.properties);

        res.render('homepage', { title: 'Homepage | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.listen(3000, () => console.log('Listening on http://localhost:3000'));