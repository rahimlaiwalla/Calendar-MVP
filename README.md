# Calendar-MVP
Calendar-MVP is a service that is meant to solve unorganized carpooling and mayhem within an organization/community. This app organizes drivers and riders neatly into "cars", and allows poolers of each car to communicate only and directly with each other in order clearly relay important carpool information, such as time changes. This application features a clickable event calendar, a ridesharing form, clickable embedded google map images, displaying the pick up location of a carpool driver, and in app Twilio Programmable Chat.

## Installation

Sign up for a google maps API account and copy your API key

Create a copy of the config.example.js file, save it as config.js, and enter your key as a string

Sign up for a [Twilio account] (https://www.twilio.com/docs/chat/javascript/quickstart), and gather account information according the the link.

Create a copy of the .env.example file, save it it as .env, and enter your Twilio API keys

## Usage

**Install Node Package Manager**

From within the root directory:

```bash
npm install
```

**Create PostgreSQL database**

_I am currently in progress of building an automatic database seeding script, so please follow the manual instructions below:_

  1. Enter into the schema.sql file.
  
  1. Scroll down to the copy commands and please change the path of the files to the file path in your directory.

  1. Please copy and paste the contents of the entire schema.sql file into your PostgreSQL Interactive Terminal, psql.

**Start server on port 3131**
 ```bash
 npm start
 ```

**Run webpack to build main.js file**
 ```bash
 npm run dev-react
 ```
 
## User Notes

When the application is served, you will come to a Log In page. Right now 8 users are set up from User1 to User8 (please note that there is no space betweer 'User' and the number)

Log in with one of the eight usernames only. No password is required at this time to enter the application.