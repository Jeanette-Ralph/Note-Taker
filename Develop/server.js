const PORT = 3001;
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const util = require('util');

// helper method for making the unique id
const uuid = require('./helpers/uuid')
const notesData = require('./db/db.json');
const { json } = require('express');

// Middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET request to return the notes.html
app.get('/notes', (req, res) => {

    res.sendFile(path.join(__dirname, './public/pages/notes.html'));
});


// in both cases a client is making a request

// html routes are the pages served
// client is requesting a page

// api routes send data 
// go to database and then serve the data back
// client is requesting data


// using this allows us to get the object instead of using a callback function,
// callback function is passed in another and called back
const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

// GET api/notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes.`);
    // path needed to be a string
    readFromFile('./db/db.json', 'utf-8').then((data) => {
        console.info(data)
        res.json(JSON.parse(data))
    }).catch((error) => {
        res.status(500).json('Error in adding a new note');
    })
});



// POST api/notes, creating a note
app.post('/api/notes', (req, res) => {

    // showing the info in the terminal
    console.info(req.rawHeaders);

    // add new note to the db.json file

    // return new note to the client

    // need to recieve new note to save on the request body, match the db.json 
    const note = req.body

    if (note) {

        const newNote = {
            // insert new note on db.json 

            note,
            note_id: uuid(),
        };

        // get all the notes, update them
        readFromFile('./db/db.json', 'utf-8').then((data) => {

            // parse the notes into a string
            const parsedNotes = [].concat(JSON.parse(data));

            return [...parsedNotes, newNote]
        }).then((updatedNotes) => {
            writeToFile('./db/db.json', JSON.stringify(updatedNotes))
        }).then(() => newNote)
    } else {
        res.status(500).json('Error in adding a new note');
    }

});

// GET request * return the index.html
app.get('*', (req, res) => {

    res.sendFile(path.join(__dirname, './public/pages/index.html'));
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} `)
);
