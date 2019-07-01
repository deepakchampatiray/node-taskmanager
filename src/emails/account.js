const sgMail = require('@sendgrid/mail');
const API_KEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(API_KEY);

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'deepakchampatiray@gmail.com',
        subject: `Welcome to the app ${name}`,
        body: 'Welcome to the app'
    }
    sgMail.send(msg);
}

module.exports = {
    sendWelcomeEmail
}
