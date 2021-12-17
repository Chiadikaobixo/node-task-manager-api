const formData = require('form-data')
const Mailgun = require('mailgun.js')
const mailgun = new Mailgun(formData)

const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
    public_key: process.env.MAILGUN_API_KEY || ''
})

const sendWellcomeEmail = (email, name) => {
    mg.messages.create('sandbox15955a1c75484addad2771772cdd5991.mailgun.org', {
        from: 'chiadikaobixo@gmail.com',
        to: email,
        subject: 'Thanks for signing up!',
        text: `Wellcome to the Task Manager Application ${name}. Let us know how you get along with the app.`,
      })  
}

const sendCancelationEmail = (email, name) => {
    mg.messages.create('sandbox15955a1c75484addad2771772cdd5991.mailgun.org', {
        from: 'chiadikaobixo@gmail.com',
        to: email,
        subject: 'opps!!! You just deleted your Task Manager Application Account',
        text: `GoodBye ${name}. Let us know why you deleted your account and let us see how we can help you.`,
      })     
}

module.exports = {
    sendWellcomeEmail,
    sendCancelationEmail
}
