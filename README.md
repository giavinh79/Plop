## Plop

Plop is a SPA (more or less) that uses React.js as its frontend framework and Adonis.js as its backend framework. It is a simple project management tool targeted towards small teams (< 8) however can also be used by individuals who want a more organized to-do list.

It leverages the best coding and security practices to ensure modularity, code reusability, code readability, and proper authentication and authorization.

The database used is mySQL which is managed using the Lucid ORM. The database can be changed to postgresQL with ease as well.

## Future plans

Redux/MobX for more complex state management

Add Rate Limiter to server-side stuff

Redis for caching certain data

Docker for containerizing different components (if needed, however this may just be a monolithic architecture)

## Development

Frontend - 'npm install' and then 'npm start' in root of project folder

Backend - 'cd to ./server', 'npm install' and then 'npm start'

Environment Variables - Make .env file with information similar to example, otherwise database migration will fail

Database (Adonis CLI required) - 'cd to ./server' and then run 'adonis migration:run'

## Practices

Although not everything is consistent yet, single quotes are desired, no semi-colons terminating lines unless it is a callback, small design changes for inline CSS styling otherwise make a 'const style' JSON object or use styled-components, split code up into components, camelCase variable names, and 4 space indentation for nested code lines.
