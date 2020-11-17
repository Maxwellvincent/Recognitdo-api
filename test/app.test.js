const {expect} = require('chai');
const request  = require('supertest');
const app  = require('../src/server');
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

    it('Grabs a user by id, and returns the user object', async (done) => {
        await request(app)
            .get('/profile/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(async (resp) => {
                console.log(resp)
                done();
            });
    })



})