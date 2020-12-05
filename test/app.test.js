const {expect} = require('chai');
const request  = require('supertest');
const app  = require('../src/server');
const bcrypt = require('bcrypt-nodejs');
const hash = bcrypt.hashSync("123");
// const fixtures = require('./fixtures');


const knex = require('../db/knex');

describe('Crud applications', () => {
    before(async () => {
        await knex.migrate.latest()
            .then(() => {
                return knex.seed.run();
            })
    })

    it('Informs whether the connection has been made', (done) => {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((resp) => {
                expect(resp.body).to.be.a('object');
                console.log(resp.body)
                done();
            })
    });



    it('Endpoint for the /api, returns an object with ok:true', (done) => {
        request(app)
            .get('/api')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((resp) => {
                expect(resp.body).to.be.a('object');
                console.log(resp.body)
                done();
            })
    });

    it('Grabs a user by id, and returns the user object', (done) => {
         request(app)
            .get('/profile/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((resp) => {
                
                expect(resp.body).to.include({id: 1});
                done();
            });
    });


    it('should not add a user', () => {
        request(app)
        .post('/register')
        .send({
            id: 3,
            hash: hash,
            email: "test23@mail.com"
          })
        .then(resp => {
            expect(resp.body).to.be('unable to register')
        })
    });

    it('should receive status of 200, when the entries endpoint  is updated', () => {
        
        request(app)
        .put('/image')
        .send({
            id: 1
        })
        .expect(200)
    });



})