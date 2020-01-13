## Plop

Plop is a SPA (more or less) that uses React.js as its frontend framework and Adonis.js as its server framework (REST API). It is a simple project management tool targeted towards small teams (< 8) however, it can also be used by individuals who want a more complex to-do list.

It leverages good coding and security practices to ensure modularity, code reusability, code readability, and proper authentication and authorization.

A relational database is used which is managed using the Lucid ORM to take advantage of models, controllers, migrations, seeds and factories. This allows us to easily replicate common SQL queries, setup the database with ease, and create dummy data.

## Future plans

Web Sockets to be implemented to allow chat, track member statuses, and show live changes on the dashboard

Add Rate Limiter to server-side stuff

Redis for caching certain data (may not be necessary after thinking about it)

Redux/MobX for more complex state management (or useContext with Reducer if not necessary)

Docker for containerizing different components (if needed, however this may just be a monolithic architecture)

Firebase Google Analytics + React Native mobile app (very into the future)

Node.js and React.js unit testing

Better server-side logging

Testing Lighthouse via Chrome Dev Tools for fixing any optimization or accessibility problems

Create seeds for fast queries and factories for creating dummy data (which the tests will use)


## Development

Frontend - 'cd web', 'npm install' and then 'npm start' in root of project folder

Backend - 'cd server', 'npm install' and then 'npm start'

Environment Variables - Make .env file with information similar to env.example, otherwise database migration will fail

Database Table Setup (Adonis CLI required) - 'cd to ./server' and then run 'adonis migration:run'

Database Deletion (Adonis CLI required) - 'cd to ./server' and then run 'adonis migration:rollback'

Database Initialization (Adonis CLI required) - 'cd to ./server' and then run 'adonis seed'. You will now be able to login as a user called 'tester@gmail.com' with password 'test'. A room will be setup for this user with some imported issues. You must have already done 'adonis migration:run' successfully.

Databases - mySQL or postgreSQL has been used and tested (for development purposes, a mySQL remote database can be setup via http://remotemysql.com and a postgresQL database can be hosted locally http://www.postgresqltutorial.com/install-postgresql/)

## Testing

Will likely use Jest for testing (and Enzyme for better React unit testing)
https://devhints.io/jest


## Practices

Coding styles: Single quotes, semi-colons, 2 space indentation, camelCase variable names... enforced by Prettier config

Coding: Functional components (with Hooks) over class components (slowly refactoring), modularize, extract to utility function for reusability when able to
