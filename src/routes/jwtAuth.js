const auth = require('express').Router();
const bcrypt = require('bcrypt-nodejs');
const knex = require('../../db/knex');



auth.post('/register', async (req,res) => {
    try {
        //1. destructure the req.body (name, email, password)
        const {name, email, password} = req.body;
        //2. check if user exist (if user doesnt exist throw error)
        const user = await knex.select('*').from('users').where({
            email: email
        });

        if(user.length !== 0){
            return res.status(401).send('User already exist')
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

        res.json(newUser[0])
        //5. generating the jwt token 


    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})
module.exports = auth;