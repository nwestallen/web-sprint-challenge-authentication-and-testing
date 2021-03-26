const server = require('./server');
const request = require('supertest');
const db = require('../data/dbConfig');
const bcrypt = require('bcryptjs');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true);
});

// Tests

// - POST /api/auth/register responds with the new user with a bcrypted password on success
// - POST /api/auth/register adds a new user with a bcrypted password to the users table on success
// - POST /api/auth/register responds with a proper status code on success
// - POST /api/auth/register responds with an error status code if username exists in user table
// - POST /api/auth/register responds with "username taken" message if username exists in users table
// - POST /api/auth/register responds with an error status code if username or password are not sent
// - POST /api/auth/register responds with "username and password required" message if either is not sent

// - POST /api/auth/login responds with a proper status code on successful login
// - POST /api/auth/login responds with a welcome message and a token on successful login
// - POST /api/auth/login responds with an error status code if username or password not sent
// - POST /api/auth/login responds with "username and password required" message if either is not sent
// - POST /api/auth/login responds with a proper status code on non-existing username
// - POST /api/auth/login responds with "invalid credentials" message on non-existing username
// - POST /api/auth/login responds with a proper status code on invalid password
// - POST /api/auth/login responds with "invalid credentials" message on invalid password

// - GET /api/jokes/ responds with an error status code on missing token
// - GET /api/jokes/ responds with a "token required" message on missing token
// - GET /api/jokes/ responds with an error status code on invalid token
// - GET /api/jokes/ responds with a "token invalid" message on invalid token
// - GET /api/jokes/ responds with the jokes on valid token

const newUser = {username: 'ChuckTesta', password: '1234'}
const existingUser = {username: 'OldUser', password: 'password'}

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe('[POST] /api/auth/register', () => {

  it('responds with a status code of 201 on success', async () => {
    const res = await request(server).post('/api/auth/register')
    .send(newUser);
    expect(res.status).toBe(201)
  });

  it('seeded bcrypt password sanity check', async () => {
    const check = await db('users').where('username', existingUser.username).first();
    expect(bcrypt.compareSync(existingUser.password, check.password)).toBeTruthy();
  });

  it('adds new user with bcrypted password to users table on success', async () => {
    await request(server).post('/api/auth/register')
    .send(newUser);
    const check = await db('users').where('username', newUser.username).first();
    expect(check.username).toBe('ChuckTesta');
    expect(bcrypt.compareSync(newUser.password, check.password)).toBeTruthy();
  });

  it('responds with new user with bcrypted password on success', async () => {
    const res = await request(server).post('/api/auth/register')
    .send(newUser);
    expect(res.body.username).toBe('ChuckTesta')
    expect(bcrypt.compareSync(newUser.password, res.body.password)).toBeTruthy();
  });

  it('responds with status code 400 if username or password is missing', async () => {
    const res1 = await request(server).post('/api/auth/register')
    .send({username: 'NoPassword'});
    expect(res1.status).toBe(400);
    const res2 = await request(server).post('/api/auth/register')
    .send({password: 'NoUser'});
    expect(res2.status).toBe(400);
  });

  it('responds with "username and password required" if either is missing', async () => {
    const res1 = await request(server).post('/api/auth/register')
    .send({username: 'NoPassword'});
    expect(res1.body.message).toBe('username and password required');
    const res2 = await request(server).post('/api/auth/register')
    .send({password: 'NoUser'});
    expect(res2.body.message).toBe('username and password required');
  });

  it('responds with status code 400 if username is taken', async () => {
    const res = await request(server).post('/api/auth/register')
    .send(existingUser);
    expect(res.status).toBe(400);
  });

  it('responds with "username taken" message if username is taken', async () => {
    const res = await request(server).post('/api/auth/register')
    .send(existingUser);
    expect(res.body.message).toBe('username taken');
  });
});

describe('[POST] /api/auth/login', () => {

  it('responds with status code 200 on successful login', async () => {
    const res = await request.server.post('/api/auth/login')
    .send(existingUser);
    expect(res.status).toBe(200);
  });

  it('responds with welcome message and token on success', async () => {
    const res = await request.server.post('/api/auth/login')
    .send(existingUser);
    expect(res.body.message).toBe('welcome, OldUser')
    expect(res.body).toHaveProperty('token');
  })

  it('responds with status code 400 if username or password missing', async () => {
    const res1 = await request.server.post('/api/auth/login')
    .send({username: 'NoPassword'});
    expect(res1.status).toBe(400);
    const res2 = await request.server.post('/api/auth/login')
    .send({password: 'NoUser'});
    expect(res2.status).toBe(400);
  });

  it('responds with "username and password required" if either is missing', async () => {
    const res1 = await request.server.post('/api/auth/login')
    .send({username: 'NoPassword'});
    expect(res1.body.message).toBe('username and password required');
    const res2 = await request.server.post('/api/auth/login')
    .send({password: 'NoUser'});
    expect(res2.body.message).toBe('username and password required');
  });

  it('responds with status code 401 if username does not exist', async () => {
    const res = await request(server).post('/api/auth/login')
    .send(newUser);
    expect(res.status).toBe(401);
  });

  it('responds with "invalid credentials" if username does not exist', async () => {
    const res = await request(server).post('/api/auth/login')
    .send(newUser);
    expect(res.body.message).toBe('invalid credentials');
  });

  it('responds with status code 401 on bad password', async () => {
    const res = await request(server).post('/api/auth/login')
    .send({username: 'OldUser', password: 'wrong'});
    expect(res.status).toBe(401);
  });

  it('responds with "invalid credentials" on bad password', async () => {
    const res = await request(server).post('/api/auth/login')
    .send({username: 'OldUser', password: 'wrong'});
    expect(res.body.message).toBe('invalid credentials');
  });

});