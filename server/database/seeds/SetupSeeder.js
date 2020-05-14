'use strict';

/*
|--------------------------------------------------------------------------
| SetupSeeder
|--------------------------------------------------------------------------
|
| This seed is for generating a user with email 'tester@gmail.com' and password 'test'. In addition,
| there is a team and a few issues in the backlog and dashboard for quick and easy testing and setup
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Encryption = use('Encryption');
const Database = use('Database');
const User = use('App/Models/User');
const Room = use('App/Models/Room');
const Issue = use('App/Models/Issue');

class SetupSeeder {
  async run() {
    try {
      await Database.transaction(async (trx) => {
        // Creating the new user, will fail if already exists
        const user = new User();
        user.fill({ email: 'tester@gmail.com', password: 'test', darkMode: 0, numTeams: 1, status: 0, avatar: 1 });
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
          default_admin_tier: 3,
          status: 0,
          currentMembers: 1,
          chat: JSON.stringify([]),
          ban_list: JSON.stringify([]),
        });
        await room.save();

        // Adding row to link room/team with user
        await trx.table('user_rooms').insert({
          user_id: user.id,
          room_id: room.id,
          role: null,
          administration_level: 6,
          notifications: JSON.stringify([]),
        });

        // Creating log of room creation
        await trx.table('logs').insert({
          room_id: room.id,
          description: `${user.email} created team `,
          object: 'Testing Room',
          date: new Date().toString(),
          type: 6,
        });

        // Creating note row for room
        await trx.table('notes').insert({
          room_id: room.id,
          notes_layout: JSON.stringify([]),
          notes: JSON.stringify([]),
          last_modified: new Date().toString(),
          last_modified_by: 0,
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
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = SetupSeeder;
