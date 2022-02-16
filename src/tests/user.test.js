const request = require('supertest')
const app = require('../app')
const User = require('../models/user')
const {userOneId, userOne, setUpDatabase} = require('./fixtures/db')


beforeEach(setUpDatabase)

test('should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'chiadikaobi',
        email: 'chiadi@example.com',
        password: 'abcd123!'
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'chiadikaobi',
            email: 'chiadi@example.com',
        },
        token: user.tokens[0].token 
    })
    //Assertion about the password not to be the plane text password up above
    expect(response.body.password).not.toBe('abcd123!')
})

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    //validate new token was saved
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'notgood@gmail.com',
        password: 'ggof567'
    }).expect(400)
})

test('should get profile for users', async () => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

test('should delete account for users', async () => {
   await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        //Validate that user was removed
        const user = await User.findById(userOneId)
        expect(user).toBeNull()
})

test('should delete account for unauthenticated users', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})

test('should upload avatar image correctly', async() => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user field',  async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'XOxO'
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('XOxO')
})

test('should not update invalid user field',  async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'canada'
    }).expect(400)
})