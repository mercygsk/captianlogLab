// require dotenv so that I can use the .env fil
require('dotenv').config();
const express = require('express');
// require mongoose so that I can connect to my db
const mongoose = require('mongoose');

//include the method-override package place this where you instructor places it
const methodOverride = require('method-override');

const app = express();
// const fruits = require('./models/fruits.js');
// we want to import the fruit model
const Log = require('./models/logs');     // Log is exported from model-logs.js where it connects to mongodb

const jsxViewEngine = require('jsx-view-engine');
//const Log = require('./models/logs');

// Global configuration
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

// Connect to Mongo
mongoose.connect(mongoURI);
mongoose.connection.once('open', () => {
    console.log('connected to mongo');
})

app.set('view engine', 'jsx');
app.set('views', './views');
app.engine('jsx', jsxViewEngine());

// moving the fruits to models/fruits.js in order to have compartmentalized code
// we are using MVC - models-views-controllers - architecture
// https://developer.mozilla.org/en-US/docs/Glossary/MVC
// const fruits = [
//     {
//         name:'apple',
//         color: 'red',
//         readyToEat: true
//     },
//     {
//         name:'pear',
//         color: 'green',
//         readyToEat: false
//     },
//     {
//         name:'banana',
//         color: 'yellow',
//         readyToEat: true
//     }
// ];

// ================ Middleware ================
//
app.use((req, res, next) => {
    console.log('Middleware: I run for all routes');
    next();
})

//near the top, around other app.use() calls
app.use(express.urlencoded({extended:false}));

//...
//after app has been defined
//use methodOverride.  We'll be adding a query parameter to our delete form named _method
app.use(methodOverride('_method'));


// These are my routes
// We are going to create the 7 RESTful routes
// There is an order for them to listed in the code
// I - N - D - U - C - E - S
//  Action      HTTP Verb   CRUD 
// I - Index    GET         READ - display a list of elements
// N - New      GET         CREATE * - but this allows user input
// D - Delete   DELETE      DELETE
// U - Update   PUT         UPDATE * - this updates our database
// C - Create   POST        CREATE * - this adds to our database
// E - Edit     GET         UPDATE * - but this allows user input
// S - Show     GET         READ - display a specific element

app.get('/', (req, res) => {
    res.send('this is my CaptainsLog root route');
});

// I - INDEX - dsiplays a list of all fruits
app.get('/logs/', async (req, res) => {
    // res.send(logs);
    try {
        const foundLogs = await Log.find({});    //Log.find comes from logs.js in models whatever we r exporting.
        console.log(foundLogs);
        console.log("foundLogs retruned: " + foundLogs);
        res.status(200).render('Index', {logs: foundLogs});
    } catch (err) {
        res.status(400).send(err);
    }
    
});


// N - NEW - allows a user to input a new fruit
app.get('/logs/new', (req, res) => {
    res.render('New');
});



// D - DELETE - PERMANENTLY removes fruit from the database
app.delete('/logs/:id', async (req, res) => {
    // res.send('deleting...');
    try {
        const deletedLog = await Log.findByIdAndDelete(req.params.id);
        console.log(deletedLog);
        res.status(200).redirect('/logs');
    } catch (err) {
        res.status(400).send(err);
    }
})


// U - UPDATE - makes the actual changes to the database based on the EDIT form
app.put('/logs/:id', async (req, res) => {
    if (req.body.shipIsBroken === 'on') {
        req.body.shipIsBroken = true;
    } else {
        req.body.shipIsBroken = false;
    }

    try {
        const updatedLog = await Log.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        console.log(updatedLog);
        res.status(200).redirect(`/logs/${req.params.id}`);
    } catch (err) {
        res.status(400).send(err);
    }
 })


// C - CREATE - update our data store
app.post('/logs', async (req, res) => {
    if(req.body.shipIsBroken === 'on') { //if checked, req.body.readyToEat is set to 'on'
        req.body.shipIsBroken = true;
    } else {  //if not checked, req.body.readyToEat is undefined
        req.body.shipIsBroken = false;
    }
console.log(req.body)
    try {
        const createdLog = await Log.create(req.body);
        console.log(createdLog)
        res.status(200).redirect('/logs');
    } catch (err) {
        res.status(400).send(err);
    }
   
})

//E-EDIT -allow the user to provide the inputs to change the fruit

app.get('/logs/:id/edit', async (req, res) => {
    // res.send(fruits[req.params.indexOfFruitsArray]);
    try {
        const foundLog = await Log.findById(req.params.id);
        res.status(200).render('Edit', {log: foundLog});
    } catch (err) {
        res.status(400).send(err);
    }

})
 

// S - SHOW - show route displays details of an individual fruit
app.get('/logs/:id', async (req, res) => {
    // res.send(fruits[req.params.indexOfFruitsArray]);
    try {
        const foundLog = await Log.findById(req.params.id);
        res.render('Show', {log: foundLog});
    } catch (err) {
        res.status(400).send(err);
    }

})

app.listen(3000, () => {
    console.log('listening');
});