const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const jwtGenerator = require("../src/utils/jwtGenerator");
const cors = require('cors');
const auth = require('../src/routes/jwtAuth');
const {PORT} = require('./config');
const knex = require('../db/knex');
const validinfo = require("../src/middleware/validinfo");
const dashboard = require('./routes/dashboard');
const authorization = require('../src/middleware/authorization');
// const db = knex({
//     client: 'pg',
//     connection: {
//         host: '127.0.0.1',
//         user: "postgres",
//         database: "smart-brain" 
//     }
// });

// db.select('*').from('users').then(data =>  {
//     console.log(data);
// });

knex('users').then(data =>  {
    // console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json()) // allows us to get req.body
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // allow preflight
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});


//ROUTES//

// register and login routes
app.use('/auth', auth)

// dashboard routes
app.use('/dashboard', dashboard)


app.get('/', (req,res) => {
    res.json({message: "You have connected to the Recognitdo Api"});
})

app.get('/api', (req,res) => {
    // res.send(database.users);
    res.json({ok:true});
});

// Signin
app.post('/signin', validinfo, async (req,res) => {
    knex.select('email', 'hash').from('login')
    .where('email', req.body.email)
    .then(data => {
        // console.log(data);
        const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
        console.log(data[0].hash)
        // console.log(isValid);
        if(isValid) {
            return knex.select('*').from('users')
            .where('email', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => {
                console.error(err.message)
                res.status(400).json('unable to get user')
            })
        } else {
            console.error(err.message)
            res.status(400).json("wrong credentials");
        }
        
    })
    .catch(err => {
        console.error(err.message)
        res.status(400).json('wrong credentials')
    })
});

// registration

app.post('/register', validinfo, async (req, res) => {
    const {email, name, password} = req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     //store hash in your password DB.
    //     console.log(hash);
    // });
    const hash = bcrypt.hashSync(password);
    knex.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                // res.json(user[0]);
                //Get the email, use email to search for user in users table. 
                const token = jwtGenerator(user[0].id)
                res.json({token});
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
});

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    knex.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if(user.length) {
            return res.json(user[0]);
        } else {
            return res.status(400).json('not found')
        }
    })
    .catch(err => res.status(400).json('error getting user'))
});

app.put('/image', authorization, async (req, res) => {
    console.log(req.user);
    const user = req.user;
    try {
        const response = await knex('users').where('email',user).increment('entries', 1);
        res.json(response);
    } catch (err) {
        console.error(err.message);
    }
//    .then(async entries => {
//        console.log(entries)
//        return res.json(entries);
//         //  console.log(typeof res.send(entries[0]));
//         // console.log(res.json(entries[0]));
//         // const results =  
//         // res.json(entries[0])
//         // console.log(results);
//         // res.json(entries[0]);
//         // res.send(entries[0]);
//    })
//    .catch(err = res.status(400).json('unable to get entries'))
});



// bcrypt.hash("bacon", null, null, function(err, hash) {
//     //store hash in your password DB.
// });

// bcrypt.compare('bacon', hash, function(err,res) {
//     //res == true
// });

// bcrypt.compare("veggies", hash, function(err,res) {
//     //res = false
// })



app.listen(PORT, ()=> {
    console.log(`App is running on port ${PORT}`);
});


module.exports = app;

/* want a route route to
/ --> res = this is working
/signin --> POST success / fail
/register --> POST = user is
/profile/:userId ---> Get = user 
/image ---> PUT --> updated use or account
*/
