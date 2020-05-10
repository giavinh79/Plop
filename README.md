## Plop

Plop is a web application that uses React.js as its frontend framework and Adonis.js (Node.js web framework) as the REST API. It is a simple project management tool targeted towards small teams (< 8) however, it can also be used by individuals who want a more complex to-do list.

A postgreSQL relational database is used which is managed using the Lucid ORM to take advantage of models, controllers, migrations, seeds and factories. This allows us to easily replicate common SQL queries, setup the database with ease, and create dummy data. Cloudinary is currently used to store images.

Current deployed on https://www.plop.team/ as version 0.8 via Netlify. Backend is deployed on https://plopwebapp.herokuapp.com/ using Heroku.

## Example Image

![Plop Dark Mode Preview](https://github.com/GV79/Plop/blob/master/readme-plop.png)

## To Do

Immediate: Refactor all css and finish dark mode, split big components into smaller ones, refactor all remaining class components to hooks, web sockets for real time notifications and live dashboard changes, JWT token refresh, encode emails and data, finish landing and help page, administrative levels, SendGrid API for email instead of nodemailer, finish notes

Longterm: More functionality for room settings and redesign (ie. member approval), changing password, mobile responsiveness, saving non-image files, project overview + schedule

Very longterm:

Store files and images on Amazon AWS S3 bucket instead

Add Rate Limiter to server-side authentication stuff and limit to # of image uploads

Firebase Google Analytics + React Native/Flutter mobile app (very into the future)

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
