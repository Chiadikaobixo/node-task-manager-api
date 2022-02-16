const request = require('supertest')
const Task = require('../models/task')
const app = require('../app')
const {
    userOne,
    userTwo,
    taskOne,
    setUpDatabase
} = require('./fixtures/db')

beforeEach(setUpDatabase)

test('should createtask for user', async() => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'my new task'
    })
    .expect(201)
    //validate that the task was saved to database and completed status
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should fetch users task', async() =>{
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toEqual(2)
})

test('should not delete other users security', async() => {
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})