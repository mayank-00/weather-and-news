# weather-and-news

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
This is a nodejs project providing apis to get weather forecast information and news information using third party services like OpenWeatherMapAPI and NewsAPI. The apis are documented with OpenAPI specifications.
	
## Technologies
Project is created with:
* nodejs
* express
* mongodb
* redis
* passport
* swagger-ui

And test cases are written with mocha and chai

## Setup

### Installations
Step 1: Clone this repository.

Step 2: Install nodejs and npm on your system. Follow following articles do it successfully.
ubuntu/linux: https://www.geeksforgeeks.org/installation-of-node-js-on-linux/
windows: https://phoenixnap.com/kb/install-node-js-npm-on-windows
mac: https://phoenixnap.com/kb/install-npm-mac

Step 3: Install redis server on your system
ubuntu: https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04
widnows: https://developer.redis.com/create/windows/
mac: https://phoenixnap.com/kb/install-redis-on-mac

Step 4: install nodemon globally with ```npm i -g nodemon```

Step 5: Now go to root directory of the project in terminal and run ```npm i``` to install all dependencies

### Create Accounts
* Create mongodb cloud account with https://account.mongodb.com/account/register. You can then follow the steps after signing up to create a database.
* Create account on OpenWeatherMap with https://home.openweathermap.org/users/sign_in to generate API key to fetch weather information.
* Create account on NewsAPI with https://newsapi.org/ to generate API key to fetch news articles

### Prepare to start server
Create a .env file with envs same as .dummy.env and updates the config as required. Take these credentials / API keys and set into .env file.

## Usage
Now upto this point we have everything installed we need to run the project. So run command ```npm start``` to run the project server. And to test run ```npm test```
