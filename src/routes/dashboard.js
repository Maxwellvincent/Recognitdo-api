const dashboard = require('express').Router();
const knex = require('../../db/knex');
const authorization = require('../middleware/authorization');


dashboard.get('/', authorization, async (req,res) => {
    try {
        //because we have authorization middleware we can access the user.id information, 
        //req.user has the payload
        // res.json(req.user)
        const user = await knex.select('name','entries').from('users').where({email: req.user})
        res.json(user[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error')
    }
})

module.exports = dashboard;