## Plop

Plop is a web application that uses React.js as its frontend framework and Adonis.js as its server framework (REST API). It is a simple project management tool targeted towards small teams (< 8) however, it can also be used by individuals who want a more complex to-do list.

A relational database is used which is managed using the Lucid ORM to take advantage of models, controllers, migrations, seeds and factories. This allows us to easily replicate common SQL queries, setup the database with ease, and create dummy data.

Current deployed on https://www.plop.team/ as version 0.8. Backend is deployed on https://plopwebapp.herokuapp.com/.

## Example Image

![Plop Dark Mode Preview](https://github.com/GV79/Plop/blob/master/readme-plop.png)

## To Do

Immediate: Refactor all css and implement dark mode, refactor routing to improve rendering performance, split big components into smaller ones, refactor all remaining class components to hooks, web sockets for real time notifications, chat, live dashboard changes, and online member statuses, JWT token refresh, more informative and designed landing page and help page, store JWT tokens so upon logout/change password previous token is blacklisted for 24h, user convenient functions (ie. filtering and search for issue tables and dashboard), encrypt image links, user emails, team names, and issue descriptions 

Longterm: More functionality for room settings (restyling, member approval), changing password/email, administration levels, mobile responsiveness, place to just write team notes/ideas/random things (empty page with + button that generates cards), saving non-image files, minimizable side navigation, replace nodemailer functionality with SendGrid API system

Very longterm:

Store files/images on Amazon AWS S3 bucket instead for better scaling

Offload some request code to message queue to shorten response time of certain more frequent calls (i.e. can offload/delay setting notifications and logs)

Add Rate Limiter to server-side stuff

Firebase Google Analytics + React Native mobile app (very into the future)

Node.js and React.js unit testing

Better server-side logging

Testing Lighthouse via Chrome Dev Tools for fixing any optimization or accessibility problems

Creating more seeds for fast queries and factories for creating dummy data (which the tests can use)

## Development

Frontend - 'cd web', 'npm install' and then 'npm start' in root of project folder

Backend - 'cd server', 'npm install' and then 'npm start'

Environment Variables - Make .env file with information similar to env.example, otherwise database migration will fail

Database Table Setup (Adonis CLI required) - 'cd to ./server' and then run 'adonis migration:run'

Database Deletion (Adonis CLI required) - 'cd to ./server' and then run 'adonis migration:rollback'

Database Initialization (Adonis CLI required) - 'cd to ./server' and then run 'adonis seed'. You will now be able to login as a user called 'tester@gmail.com' with password 'test'. A room will be setup for this user with some imported issues. You must have already done 'adonis migration:run' successfully.

Databases - postgreSQL (for development purposes, a mySQL remote database can be setup via http://remotemysql.com and a postgresQL database can be hosted locally via http://www.postgresqltutorial.com/install-postgresql/)

## Testing

First, make sure adonis seed has been run prior to doing this. Use 'npm test' to execute tests on the React application and use 'npm run coverage' to analyze test coverage. Uses Jest and React Testing Library for unit testing.


## Practices

Coding styles enforced by Prettier config
