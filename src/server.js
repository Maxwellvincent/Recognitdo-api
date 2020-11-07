const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex'); 
const {PORT, NODE_ENV,CLIENT_ORIGIN} = require('./config');


const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: "postgres",
        database: "smart-brain" 
    }
});

db.select('*').from('users').then(data =>  {
    console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: CLIENT_ORIGIN
}));

// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'John',
//             email: 'john@example.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '1234',
//             name: 'Sally',
//             email: 'sally@example.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ],
//     login: [
//         {
//             id: "123",
//             hash: '',
//             email: "john@example.com"
//         }
//     ]
// }

app.get('/api/', (req,res) => {
    // res.send(database.users);
    res.json({ok:true});
});


app.post('/signin', (req,res) => {
    db.select('email', 'hash').from('login')
    .where('email', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
        if(isValid) {
            return db.select('*').from('users')
            .where('email', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json("wrong credentials");
        }
        
    })
    .catch(err => res.status(400).json('wrong credentials'))
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     //store hash in your password DB.
    //     console.log(hash);
    // });
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
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
                    res.json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
});

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    db.select('*').from('users').where({
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

app.put('/image', (req, res) => {
    const {id} = req.body;
   db('users').where('id','=', id ).increment('entries', 1)
   .returning('entries')
   .then(entries => {
       res.json(entries[0]);
   })
   .catch(err = res.status(400).json('unable to get entries'))
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


/* want a route route to
/ --> res = this is working
/signin --> POST success / fail
/register --> POST = user is
/profile/:userId ---> Get = user 
/image ---> PUT --> updated use or account
*/
