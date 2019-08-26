## Plop

Plop is a SPA (more or less) that uses React.js as its frontend framework and Adonis.js as its server framework (REST API). It is a simple project management tool targeted towards small teams (< 8) however, it can also be used by individuals who want a more organized to-do list.

It leverages the best coding and security practices to ensure modularity, code reusability, code readability, and proper authentication and authorization.

A relational database is used which is managed using the Lucid ORM to take advantage of models, controllers, migrations, seeds and factories. This allows us to avoid writing SQL queries, setup the database with ease, and create dummy data.

## Future plans

Web Sockets to be implemented to allow chat, track member statuses, and show live changes on the dashboard

Add Rate Limiter to server-side stuff

Redis for caching certain data (may not be necessary after thinking about it)

Redux/MobX for more complex state management

Docker for containerizing different components (if needed, however this may just be a monolithic architecture)

Firebase Google Analytics + React Native mobile app

Node.js and React.js unit testing

Better server-side logging

Testing Lighthouse via Chrome Dev Tools for fixing any optimazation or accessibility problems

Create seeds for fast queries and factories for creating dummy data (which the tests will use)


## Development

Frontend - 'npm install' and then 'npm start' in root of project folder

Backend - 'cd to ./server', 'npm install' and then 'npm start'

Environment Variables - Make .env file with information similar to example, otherwise database migration will fail

Database Setup (Adonis CLI required) - 'cd to ./server' and then run 'adonis migration:run'

Database Deletion (Adonis CLI required) - 'cd to ./server' and then run 'adonis migration:rollback'

Databases - mySQL or postgreSQL has been used and tested


## Practices

Although not everything is consistent yet, single quotes are desired, no semi-colons terminating lines unless it is a callback, small design changes for inline CSS styling otherwise make a 'const style' JSON object or use styled-components, split code up into components, camelCase variable names, and 2 space indentation for nested code lines. In the future, add a ESlint config so that coding styles are enforced.

Other preferred styles: {{ attribute: 'value' }}, <Component />, <> over <React.Fragment>, extends React.Component
