'use strict';

const nodemailer = require('nodemailer');
const Database = use('Database');
const Env = use('Env');
const User = use('App/Models/User');
const Hash = use('Hash');
const { validate } = use('Validator');

// Add new columns for user and room (temp) for potential upgrades in the future
// Example - level, expiry date
// Encrypt room IDs and pass that to client, decrypt on return
class UserController {
  async addNewUser({ request, response }) {
    const rules = {
      email: 'required|email',
      password: 'required',
    };

    const validation = await validate(request.body, rules);
    if (validation.fails()) {
      response.status(404).send('Error');
    } else {
      try {
        const user = new User();
        const { email, password } = request.body;
        user.fill({ email: email, password: password, numTeams: 0, status: 0, avatar: 1 });
        await user.save();

        const mailOptions = {
          from: Env.get('EMAIL_USER'),
          to: user.email,
          subject: 'Welcome to Plop!',
          html: '<p>You have successfully signed up.</p>',
        };

        let transport = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          secure: 'false',
          auth: {
            user: Env.get('EMAIL_USER'),
            pass: Env.get('EMAIL_PASSWORD'),
          },
        });

        transport.sendMail(mailOptions, res => {
          if (res) console.log(`MAIL_ERROR ${res}`);
        });
        response.status(200).send('User created successfully');
      } catch (err) {
        console.log(`(user_add) ${new Date()}: ${err.message}`);
        response.status(404).send('Error');
      }
    }
  }

  async login({ request, auth, response }) {
    const { email, password } = request.body;
    try {
      const jwt = await auth.attempt(email, password);
      const { token } = jwt; // add secure attribute when deployed(?)
      response.cookie('XSStoken', token, {
        httpOnly: true,
      });
      response.status(200).send();
    } catch (err) {
      console.log(`(user_login) ${new Date()}: ${err.message}`);
      response.status(404).send('Error');
    }
  }

  async getUserInfo({ auth, response }) {
    try {
      const user = await auth.getUser();

      let res = await Database.select('email', 'avatar')
        .from('users')
        .where('id', user.id);

      const date = new Date();
      response.status(200).json({ avatar: res[0].avatar, email: res[0].email, date });
    } catch (err) {
      console.log(`(user_avatar_get) ${new Date()}: ${err.message}`);
      response.status(404).send('Error');
    }
  }

  async setAvatar({ request, auth, response }) {
    try {
      const user = await auth.getUser();
      const { avatar } = request.body;

      await Database.table('users')
        .where('id', user.id)
        .update('avatar', avatar);
      response.status(200).send();
    } catch (err) {
      console.log(`(user_avatar_set) ${new Date()}: ${err.message}`);
      response.status(404).send('Error');
    }
  }

  // Using JWT, so I am actually checking for the token here
  async checkSession({ auth, response }) {
    try {
      await auth.check();
      response.status(200).send();
    } catch (err) {
      // console.log(`(user_session_check) ${new Date()}: ${err.message}`);
      response.status(404).send();
    }
  }

  // JWT stored in httpOnly token to prevent XSS and CSRF
  async logout({ response }) {
    try {
      response.clearCookie('XSStoken');
      response.clearCookie('room');
    } catch (err) {
      console.log(`(user_logout) ${new Date()}: ${err.message}`);
      response.status(404).send('Error');
    }
  }
}

module.exports = UserController;
