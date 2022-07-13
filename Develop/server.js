const PORT = 3001;
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// helper method for making the unique id
const uuid = require('../Develop/helpers/uuid')
const notesData = require('../Develop/db/notes');

// Middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET request to return the notes.html
app.get('/notes', (req, res) => {

    // letting user know POST request recieved
    res.json(`${req.method} request received`);

    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// GET request * return the index.html
app.get('/*', (req, res) => {

    // letting user know POST request recieved
    res.json(`${req.method} request received`);

    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// GET api/notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes.`);
    readFromFile(notesData).then((data) => res.json(JSON.parse(data)));
});

// POST api/notes
app.post('api/notes', (re, res) => {

    // letting user know POST request recieved
    res.json(`${req.method} request received`);

    // showing the info in the terminal
    console.info(req.rawHeaders);

    // add new note to the db.json file

    // return new note to the client

    // need to recieve new note to save on the request body
    const { note } = req.body;

    if (note) {

        const newNote = {
            note,
            note_id: uuid(),
        };

        const response = {
            status: 'succees',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in adding a new note');
    }

});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} `)
);
