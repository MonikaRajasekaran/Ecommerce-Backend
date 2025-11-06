## Overview
The API needs some services to run:  
- The Node.js ExpressJS app (API)
- MongoDB (main DB)  
- Nginx (reverse proxy)  

Rather than having to set up these services individually on your development machine, everything is set up via Docker, and specifically docker-compose, that allows you to run multiple containers in one go.

## Setup
- Install [docker-compose](https://docs.docker.com/compose/install/) (part of [Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install/))
- Create the directory that will be used as the MongoDB volume by Docker: `mkdir -p ~/data/docker-mongo`. You should have sufficient permissions to write to that directory
- Navigate to the directory where the app is installed and build the Docker images. Run: `docker-compose build`. Grab a coffee... this might take a while :-) 
- Populate the `.env` file with all the required variables (ask me for the values as they are not checked in the repo of course, `.env` is `.gitignore`'d)
- Set up a virtual host so that you can access the API via a dedicated domain. Add the following entry to `/etc/hosts`: `127.0.0.1 api-dev.visa-demo-experiences.local`
- When the Docker images have finished building, it's time to fire up the containers: `docker-compose up`. This might take just over a minute (the reason is because services are waiting for each other to complete). Unless you run docker-compose in the background (in detached mode, `-d`, you can just ctrl+C to stop the containers, and then to make sure you can run `docker-compose down`, and `docker-compose ps` to check if the containers are still running.
- When the services are up, you should be able to hit the API by accessing http://api-dev.visa-demo-experiences.local (if you set up the virtual host). This is accessing the API via the Nginx reverse proxy (that is listening on port 80). If you wish, you can also access directly the API itself by calling http://localhost:3000 (the API runs on port 3000).

# NodeJS Scaffolder

![N|Solid](https://trainingprdcdnendpoint.azureedge.net/Images/nodejs-520.jpg)

Scaffolder consist of four major libraries.

  - Nodejs
  - Express framework
  - Mongodb
  - Mongoose 

### Git pre-commit hooks
At the root of the project directory, create a file called pre-commit under .git/hooks with the content from the pre-commit file at the root of the repo here. This is a Git pre-commit hook that will get executed, every time when you do a commit (before the commit). The script will have to return successfully for the commit to go through. You can read more about Git hooks [here](https://githooks.com/).

In our case, we run linting on the changed files, before every commit.

### Environment Variables

| Variable | Value |
| ------ | ------ |
| NODE_ENV | `development` / `test` / `qa` / `production` |

or 
```sh
$ NODE_ENV=production node app
```

### Installation & Execution

Node Js Scaffolder recommended [Node.js](https://nodejs.org/) v8+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ npm start or grunt
```
Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:3000
```
# Folder Structure

Scaffolder is using `Model-Routes-Controllers-Services` code structure. Server contains the following folder structure
  - conrtollers
  - Helpers
  - Middlewares
  - Models
  - Routes
  - Services

##### **Controllers**
Controllers are the one which handles the api request and responses. It control's the whole api event. File naming convention should ends with `controller.js` and also `{Module Name}` should be in plural.

###### E.g
`users.controller.js`

##### **Helpers**
Helper files are to support the business logic on the service layers. File naming convention should ends with `{Module Name}.helper.js` .

###### E.g
`db.helper.js`

##### **Middlewares**
Like Helper, Middlewares are to supports the controller. 
> e.g: Request Validator definition can be a middleware, etc.. 

Middleware functions can perform the following tasks:
* Execute any code.
* Make changes to the request and the response objects.
* End the request-response cycle.
* Call the next middleware in the stack.

Middleware folder: can have multiple subfolders 
  - *Validator - Middleware to Validator Request*
  - *DbFetch - Middleware to Prefetch the DB content based on id*
    
##### **Routes**
Routes are the primary entry point for the rest API's. File naming convention should be ends with `{Module Name}.routes.js` and also `{Module Name}` should be in plural.

###### E.g
`users.routes.js`

##### **Models**
Model will have the schema definition of each collection. We are using Mongoose library to facilitate the model vs DB collection mapping. File naming convention should ends with `{Module Name}.model.js` and also `{Module Name}` should be in plural.

###### E.g
`user.model.js`

### Request Validators
express-validator is a set of express.js middlewares that wraps validator.js validator and sanitizer functions.

[express-validator ](https://express-validator.github.io/docs/index.html)

##### Documentation & Comments
###### API Documentation
Scaffolder is using ApiDoc-Swagger library to generate the Swagger doc json configuration.
To generate doc, please execute the following command.
> npm run doc

 Generated doc will be available under the folder called `doc`
 
###### Comments
Code comments, please refer the following link for more details
[Comments Best Practice](https://www.digitalocean.com/community/tutorials/how-to-write-comments-in-javascript)
 
### Test Case
Scaffolder includes Unit and Functional Test cases

###### Unit test
Unit testing is a level of software testing where individual units/ components of a software are tested. The purpose is to validate that each unit of the software performs as designed. A unit is the smallest testable part of any software. It usually has one or a few inputs and usually a single output.

To run Unit test
```sh
$ npm run unit-test
```

###### Functional test
Functional testing is a type of software testing whereby the system is tested against the functional requirements/specifications. Functions (or features) are tested by feeding them input and examining the output. Functional testing ensures that the requirements are properly satisfied by the application.

To run Functional test
```sh
$ npm run api-test
```

| npm Package | link |
| ------ | ------ |
| Mocha | [Link](https://www.npmjs.com/package/chai) |
| Chai | [Link](https://www.npmjs.com/package/mocha) |


### Linting Style
`ESlint` - A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript. Maintain your code quality with ease..

Scaffolder is using `Airbnb Style` guide

| Documentation | link |
| ------ | ------ |
| ES lint | [Link](https://eslint.org/docs/user-guide/getting-started) |
| Airbnb | [Link](https://github.com/airbnb/javascript) |


### Todos

 - Write MORE Tests
 - Add Protect Config

