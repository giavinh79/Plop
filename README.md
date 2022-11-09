# Plop

**Note** - This project was originally created to develop my React.js knowledge with a focus on feature delivery (completeness). Therefore, the code is not close to what I would consider production quality and a future goal is to refactor both the frontend and backend at some point. Currently does not work with incognito due to how cookies are being currently used (for authorization).

Plop is an open-source web application that uses React.js as its frontend library and Adonis.js (Node.js framework) as the REST API. It is a simple project management tool targeted towards small teams (< 12) where users can create, assign, and manage tasks.

For data storage, a postgreSQL relational database is used. The Lucid ORM is leveraged for the benefits of models, controllers, migrations, seeds, and factories. This allows us to easily execute common queries, setup the database with ease, and create dummy data. Cloudinary is currently used to store images.

![Plop Dark Mode Preview](https://github.com/GV79/Plop/blob/master/readme-plop.png)

> [Current deployed on https://www.plopteam.rocks/ as version 0.8 via Netlify. Backend is deployed on https://plopwebapp.herokuapp.com/ using Heroku.](https://www.plopteam.rocks/)

# Features

- Drag and Drop dashboard
- Create/join up to 3 teams easily
- Create, assign, and track tasks
- Real-time chat
- Team notes (with real-time changes)
- User and team settings
- Filterable tables containing backlog and active tasks/issues
- Project overview (basic statistics)
- Schedule (lists issues w/ deadlines on the calendar)
- Colorful and filterable logs to easily track team actions
- Member hierarchy and management (kick/ban/promote/demote members)
- Help page (for understanding how to use various features within the site)
- Theming
- Basic sprint implementation

# Getting Started

## Development

### Running Frontend

If you would like to only look at the frontend, go into web/src/Routes.js and edit the `ProtectedRoute` component on line 25
(set `authenticated` to always be true and remove the `useEffect` function).

1. Go to web folder and install dependencies (requires Node.js and NPM).

```
$\web npm install
```

2. Run frontend application.

```
$\web npm start
```

### Running Server

1. Go to server folder, set up environment variables in your local .env file (see .env.example for attributes that you must fill in), and have a working PostgresQL database you can connect to.

2. Set up database (requires [Adonis CLI](https://adonisjs.com/docs/4.1/installation)) with proper tables.

```
$\server adonis migration:run
```

3. Fill database with dummy test data (you can now login as a user called 'tester@gmail.com' with password 'test' with a prebuilt team).

```
$\server adonis seed
```

4. Go to server folder and install dependencies (requires Node.js and NPM).

```
$\server npm install
```

5. Run server on localhost:3333.

```
$\server npm start
```

Note: For resetting the database (all your data will be deleted)

```
$\server adonis migration:rollback
```

### Docker

Use Docker Desktop and `docker-compose up -d` to manage the creation and running of the various services necessary.

### DB Resources

postgreSQL can be hosted locally via http://www.postgresqltutorial.com/install-postgresql/ and if you want to use mySQL, a mySQL remote database can be setup via http://remotemysql.com (will require some code changes for app to function properly though due to how differently they deal with JSON data types).

## Project To Dos

**Immediate**

- Throttling request, reCAPTCHA for signup, team data limits
- Look at any accessibility problems (ie. contrast)
- Completely finish dark theme
- Enabling locked settings in team settings

**Future Enhancements and Features**

- Some features discussed in ROADMAP.md
- Optimizing performance (can audit through Google Lighthouse and React Profiler)
- Mobile app
- SendGrid API instead of nodemailer for emails
- More flexibility (renaming dashboard columns, making custom tags...)
- More functionality for team settings (ie. admin approval)
- Performance version of websocket AdonisJS
- JWT token refresh
- Enable saving files as well and move to Amazon AWS S3 Bucket instead of Cloudinary
- Better server-side logging for analytics, debugging...
- More DB seeds for fast queries and factories for creating dummy data (which the tests can use)
- CI and CD (Travis CI)
- Redux Toolkit for simplifying state in some areas
- Create issues directly on schedule page for easy deadlines
- Optimize antd css loading (babel-plugin-import)
- Heroku jobs for cleaning up unused images or inactive teams
- Modifiable permissions
- Chat page (make it easier to read chat and enable searching for text)
- @ing someone in chat which creates a sound ping if they are online
- Upgraded schedule (easily drag and drop issues on to the calendar to set/update deadlines)
- Invite link (automatically make user join team, signup/login flow if user not logged in)

**Clean up Code**

I am aware that there are some discrepancies regarding styling and class/function components along with areas in the project that could be further modularized or better organized (code/folder structure, naming, functions...etc.).

- Delete pages folder, organize components folder, and improve naming
- Refactoring CSS into styled-components where possible and re-use this across project
- Component modularization to better organize code and to follow DRY principle
- Refactoring all remaining class components to function components + hooks
- More unit testing with React Testing Library + Jest
- Put all REST calls in restCalls.js
- Proper error status codes and handling functions for both client and server
- Consistent naming (some table names are camel case whereas others are snake case, styles.css vs componentName.css ...etc.)
- Server app: Leverage models more, more utility/middleware functions to reduce repeated code, consistent syntax...
- Splitting functions up more (reducing side effects, abstracting logic...)
- Maybe take any utility functions out of each component and put them in a NameServices.js file
- Add React Query or SWR
- Lyra for search?
- dnd-kit over react-beautiful-dnd?
- CI/CD pipeline with dev, staging and prod environments
- React Location (TanStack) instead of react-router?

## Testing

**'adonis seed'** must have been run and executed properly to fill DB with dummy data. The tests are designed using Jest and React Testing Library.

1. Execute unit tests on the React FE application.

```
$\web npm test
```

2. Analyze test coverage

```
$\web npm run coverage
```

## Practices

**Coding styles** enforced by Prettier config (found in `.prettierrc` files in root folders).

**Naming scheme:** Camel case for JS functions/variables, hyphen delimiters for URLs, server endpoints, and CSS class selectors, and finally snake case for DB column and table names (there may be code discrepancies in which I hope to fix sometime).
