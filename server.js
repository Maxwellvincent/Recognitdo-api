const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@example.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '1234',
            name: 'Sally',
            email: 'sally@example.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: "123",
            hash: '',
            email: "john@example.com"
        }
    ]
}

app.get('/', (req,res) => {
    res.send(database.users);
});


app.post('/signin', (req,res) => {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json('success');
    }else {
        res.status(400).json('error logging in');
    }
    res.json("This is working");
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        //store hash in your password DB.
        console.log(hash);
    });
    database.users.push({
            id: '123',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
    });
    res.json(database.users[database.users.length -1]);
});

app.get('/profile/:id', (req, res, next) => {
    const {id} = req.params;
    const user = database.users.filter((user) => user.id === id);
    if(user.id === id){
        res.json(user);
    }else {
        console.log("this works");
        res.status(404).json('no such user');
    }
    next();
});

app.put('/image', (req, res, next) => {
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if(!found) {
        res.status(400).json('not found');
    }
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



app.listen(3001, ()=> {
    console.log('App is running on port 3000');
});


/* want a route route to
/ --> res = this is working
/signin --> POST success / fail
/register --> POST = user is
/profile/:userId ---> Get = user 
/image ---> PUT --> updated use or account
*/
