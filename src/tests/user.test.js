const request = require('supertest')
const { getMaxListeners } = require('../app')
const app = require('../app')
const User = require('../models/user')

const userOne = {
    name: 'Xo',
    email: 'Xo@gamil.com',
    password: '123vbgfs'
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'chiadikaobi',
        email: 'chiadi@example.com',
        password: 'abcd123!'
    }).expect(201)
})

test('should login existing user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('should not login nonexistent user', async() => {
    await request(app).post('/users/login').send({
        email: 'notgood@gmail.com',
        password: 'ggof567'
    }).expect(400)
})