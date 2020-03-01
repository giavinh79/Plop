## Plop

Plop is a web application that uses React.js as its frontend framework and Adonis.js as its server framework (REST API). It is a simple project management tool targeted towards small teams (< 8) however, it can also be used by individuals who want a more complex to-do list.

A relational database is used which is managed using the Lucid ORM to take advantage of models, controllers, migrations, seeds and factories. This allows us to easily replicate common SQL queries, setup the database with ease, and create dummy data.

Current deployed on https://www.plop.team/ as version 0.6. Backend is deployed on https://plopwebapp.herokuapp.com/.


## To Do

Immediate: JWT token refresh, add notification icon design (notified when someone comments on an issue assigned to you or someone comments on something you commented on), refactoring routes, making actions clickable on Active and Backlog tables, more informative landing page

Longterm: Make functionality for room settings work (room deletion, add pending invitations table...), themes and changing password, administration levels, mobile responsiveness (or alert to download mobile app)

Very longterm:

Web Sockets to be implemented to allow chat, track member statuses, and show live changes on the dashboard

Add Rate Limiter to server-side stuff

Firebase Google Analytics + React Native mobile app (very into the future)

Node.js and React.js unit testing

Better server-side logging

Testing Lighthouse via Chrome Dev Tools for fixing any optimization or accessibility problems

Creating more seeds for fast queries and factories for creating dummy data (which the tests will use)

## Development

Frontend - 'cd web', 'npm install' and then 'npm start' in root of project folder

Backend - 'cd server', 'npm install' and then 'npm start'

Environment Variables - Make .env file with information similar to env.example, otherwise database migration will fail

Database Table Setup (Adonis CLI required) - 'cd to ./server' and then run 'adonis migration:run'

Database Deletion (Adonis CLI required) - 'cd to ./server' and then run 'adonis migration:rollback'

Database Initialization (Adonis CLI required) - 'cd to ./server' and then run 'adonis seed'. You will now be able to login as a user called 'tester@gmail.com' with password 'test'. A room will be setup for this user with some imported issues. You must have already done 'adonis migration:run' successfully.

Databases - postgreSQL (for development purposes, a mySQL remote database can be setup via http://remotemysql.com and a postgresQL database can be hosted locally via http://www.postgresqltutorial.com/install-postgresql/)

## Testing

Will use Jest + React Testing Library


## Practices

Coding styles enforced by Prettier config
