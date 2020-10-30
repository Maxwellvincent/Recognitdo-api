const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());


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
            password: 'cookies',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req,res) => {
    res.send("This is working");
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
    res.json(user);
    next();
});


app.listen(3000, ()=> {
    console.log('App is running on port 3000');
});


/* want a route route to
/ --> res = this is working
/signin --> POST success / fail
/register --> POST = user is
/profile/:userId ---> Get = user 
/image ---> PUT --> updated use or account
*/
