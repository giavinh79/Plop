'use strict';

const nodemailer = require('nodemailer');
const Hashids = require('hashids/cjs');
const hashids = new Hashids('', 9);
const Database = use('Database');
const Env = use('Env');
const User = use('App/Models/User');
const { validate } = use('Validator');

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
        user.fill({ email: email, password: password, numTeams: 0, darkMode: 0, status: 0, avatar: 1 });
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

        transport.sendMail(mailOptions, (res) => {
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
      response.cookie(
        'XSStoken',
        token,
        Env.get('DEVELOPMENT') === 'true'
          ? {
              httpOnly: true,
              path: '/',
            }
          : {
              httpOnly: true,
              secure: true,
              sameSite: 'none',
              path: '/',
            }
      );

      response.status(200).send();
    } catch (err) {
      console.log(`(user_login) ${new Date()}: ${err.message}`);
      response.status(404).send('Error');
    }
  }

  async getUserInfo({ auth, response }) {
    try {
      const user = await auth.getUser();
      let res = await Database.select('email', 'avatar').from('users').where('id', user.id);

      const date = new Date();
      response.status(200).json({ avatar: res[0].avatar, email: res[0].email, date });
    } catch (err) {
      console.log(`(user_info_get) ${new Date()}: ${err.message}`);
      response.status(404).send('Error');
    }
  }

  async getUserRoomInfo({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      if (!decryptedRoomId) {
        return response.status(200).json({ role: null, activity: null });
      }

      let result = await Database.from('user_rooms').where('user_id', user.id).where('room_id', decryptedRoomId);
      if (result.length === 0) throw new Error('Unauthorized Access');

      let [data] = await Database.select('role').from('user_rooms').where({
        room_id: decryptedRoomId,
        user_id: user.id,
      });

      let activity = await Database.select('description', 'issue_id', 'object').from('logs').where({
        room_id: decryptedRoomId,
      });

      response
        .status(200)
        .json({ role: data.role, activity: activity.filter((item) => item.description.includes(user.email)) });
    } catch (err) {
      console.log(`(user_roomInfo_get) ${new Date()}: ${err.message}`);
      response.status(404).send('Error');
    }
  }

  // Pertains to both user and user-room data
  async setUserInfo({ request, auth, response }) {
    try {
      const user = await auth.getUser();
      const { avatar, role } = request.body;
      const decryptedRoomId = hashids.decodeHex(request.cookie('room'));

      await Database.table('users').where('id', user.id).update({ avatar: avatar });
      if (role != null) {
        await Database.table('user_rooms')
          .where({
            room_id: decryptedRoomId,
            user_id: user.id,
          })
          .update({ role: role });
      }

      response.status(200).send();
    } catch (err) {
      console.log(`(user_avatar_set) ${new Date()}: ${err.message}`);
      response.status(404).send('Error');
    }
  }

  async getAvatar({ auth, response }) {
    try {
      const user = await auth.getUser();

      const data = await Database.table('users').select('avatar').where('id', user.id);
      response.status(200).json({ avatar: data[0].avatar });
    } catch (err) {
      console.log(`(user_avatar_get) ${new Date()}: ${err.message}`);
      response.status(404).send('Error');
    }
  }

  // Using JWT, so I am actually checking for the token here
  async checkSession({ auth, response }) {
    try {
      const user = await auth.getUser();
      response.status(200).send({ email: user.email });
    } catch (err) {
      console.log(err);
      response.status(404).send();
    }
  }

  // JWT stored in httpOnly token to prevent XSS and CSRF
  async logout({ response }) {
    try {
      response.clearCookie('XSStoken');
      response.clearCookie('room');

      response.cookie('room', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        overwrite: true,
        path: '/',
      });
      response.cookie('XSStoken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        overwrite: true,
        path: '/',
      });
      response.status(200).send();
    } catch (err) {
      console.log(`(user_logout) ${new Date()}: ${err.message}`);
      response.status(404).send('Error');
    }
  }
}

module.exports = UserController;
