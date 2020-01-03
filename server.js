const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : '',
      password : '',
      database : 'face-rec'
    }
  });

const app = express();
app.use(express.json()); // former body-parser now added to express! a MUST have here!
app.use(cors())

app.get('/', (req, res) => {
    res.send('it is working!');
})

// using dependency injection for endpoints
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

//this below is just a cleaner way of passing dependencies(it works the same), check register.js
app.post('/register', register.handleRegister(db, bcrypt) );

// using this syntax ('profile/:id') means that you can enter anything in the browser (/profile/123example)
// and will be able to grab this id through the req.params
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})

// /signin --> POST = success/fail
// /register --> POST = user
// /profile/:userid --> GET = user
// /image --> PUT --> user
