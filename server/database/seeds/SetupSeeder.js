'use strict';

/*
|--------------------------------------------------------------------------
| SetupSeeder
|--------------------------------------------------------------------------
|
| This seed is for generating a user with email 'tester@gmail.com' and password 'test'. In addition,
| there is a room/team and a few issues in the backlog and dashboard for quick and easy testing and setup
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Encryption = use('Encryption');
const Database = use('Database');
const User = use('App/Models/User');
const Room = use('App/Models/Room');
const Issue = use('App/Models/Issue');

// const createIssue = async (roomID, ) => {
//   let issue = new Issue()
//   issue.fill({
//     title: 'Implement Socket.IO',
//     room: roomID,
//     shortDescription: 'npm install the necessary modules and setup websockets',
//     description: 'This is so that the dashboard can be auto-refreshed on any changes',
//     assignee: null,
//     creator: user.email,
//     priority: 0,
//     status: 0,
//     tag: JSON.stringify(['Backend', 'Frontend'])
//   })
//   await issue.save()
// }

class SetupSeeder {
  async run() {
    try {
      // Creating the new user, will fail if already exists
      const user = new User();
      user.fill({ email: 'tester@gmail.com', password: 'test', numTeams: 1, status: 0, avatar: 1 });
      await user.save();

      // Creating a room tied to the user above
      const room = new Room();
      room.fill({
        admin: user.id,
        name: 'Testing Room',
        description:
          'This room was created automatically using a database seed. Manual and automated testing will be done using this room.',
        password: Encryption.encrypt('test'),
        maxMembers: 12,
        private: false,
        adminApproval: false,
        status: 0,
        currentMembers: 1,
      });
      await room.save();

      // Adding row to link room/team with user
      await Database.table('user_rooms').insert({
        user_id: user.id,
        room_id: room.id,
        role: null,
        notifications: JSON.stringify([]),
      });

      // Creating issues for the room/team's dashboard and backlog
      let issue = new Issue();
      issue.fill({
        title: 'Implement Socket.IO',
        room: room.id,
        shortDescription: 'npm install the necessary modules and setup websockets',
        description: 'This is so that the dashboard can be auto-refreshed on any changes',
        assignee: null,
        creator: user.email,
        priority: 0,
        status: 1,
        tag: JSON.stringify(['Backend', 'Frontend']),
        image: JSON.stringify([]),
        comments: JSON.stringify([]),
      });
      await issue.save();

      issue = new Issue();
      issue.fill({
        title: 'Google SEO',
        room: room.id,
        shortDescription: 'Improve SEO',
        description: 'Add meta data, robots.txt, improve accessibility...etc.',
        assignee: null,
        creator: user.email,
        priority: 1,
        status: 0,
        tag: JSON.stringify([]),
        image: JSON.stringify([]),
        comments: JSON.stringify([]),
      });
      await issue.save();

      issue = new Issue();
      issue.fill({
        title: 'Implement unit tests',
        room: room.id,
        shortDescription: 'Unit testing React',
        description: 'Create basic tests with React Testing Library',
        assignee: 'tester@gmail.com',
        creator: user.email,
        priority: 0,
        status: 1,
        tag: JSON.stringify(['Backend']),
        image: JSON.stringify([]),
        comments: JSON.stringify([]),
      });
      await issue.save();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = SetupSeeder;
