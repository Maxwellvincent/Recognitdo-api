const auth = require('express').Router();
const bcrypt = require('bcrypt-nodejs');
const knex = require('../../db/knex');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validinfo');
const authorization = require('../middleware/authorization');

//Register Rout
auth.post('/register', validInfo, async (req,res) => {
    try {
        //1. destructure the req.body (name, email, password)
        const {name, email, password} = req.body;
        //2. check if user exist (if user doesnt exist throw error)
        const user = await knex.select('*').from('users').where({
            email: email
        });

        // console.log(user);

        if(user.length !== 0){
            return res.status(401).json('User already exist')
        }
        
        //3. Bcrypt the user password 
        const saltRound = 10;
        const salt = bcrypt.genSaltSync(saltRound);
        const bcryptPassword = bcrypt.hashSync(password, salt);

        //4. enter the user inside database
        //inside of login table insert password, and email
        // inside of users insert name, email, 
        const newUser = await knex('login').insert({email, hash: bcryptPassword}).returning('email')
        .then(user_email => {
            return knex('users')
            .insert({
                name,
                email: user_email[0],
                joined: new Date()
            })
            .returning('*')
        })

        
        //5. generating the jwt token 
        const token = jwtGenerator(newUser[0].id);
        res.json({token});

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//Login route
auth.post("/login", validInfo, async (req,res) => {
    try {

        //1. destructure the req.body 
        const {email, password} = req.body;
        //2. check is user doesnt exist, if not throw error
        const user = await knex.select('*').from('login').where({email})
        console.log(user);
        if(user.length === 0 ){
            //means that user does not exist
            return res.status(401).json("Password or Email is incorrect");
        }

        //3. Check if the password is the same as the database login password.

        const validPassword = bcrypt.compareSync(password, user[0].hash);
        //returns a boolen
        if(!validPassword){
            return res.status(401).json("Password of Email is incorrect");
        }
        
        //4. give token to the users. 

        const token = jwtGenerator(user[0].email);
        res.json({token});

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//Verification route

auth.get("/is-verify", authorization, async (req,res) => {
    try {
        res.json(true);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = auth;