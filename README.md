# Calendar-MVP
Calendar-MVP is a service that is meant to solve unorganized carpooling and mayhem within an organization/community. This app organizes drivers and riders neatly into "cars", and allows poolers of each car to communicate only and directly with each other in order clearly relay important carpool information, such as time changes. This application features a clickable event calendar, a ridesharing form, clickable embedded google map images, displaying the pick up location of a carpool driver, and in app Twilio Programmable Chat.

## Installation

Sign up for a google maps API account and copy your API key

Create a copy of the config.example.js file, save it as config.js, and assing your key, as a string, to geocodeAPI_Key.

Sign up for a Twilio account, and gather account information according to this [link](https://www.twilio.com/docs/chat/javascript/quickstart).

Create a copy of the .env.example file, save it as .env, and replace each asterisk placeholders with the appropriate Twilio API keys.

## Usage

**Check the schema script, and adjust if necessary**

1. Enter the package.json file

1. scroll to the "schema" key in the script sections of the file.

1. adjust the psql command according to how you connect to your postgreSQL database.

**Install Node Package Manager**

From within the root directory:

```bash
npm install
```

**Create PostgreSQL database**

1. In the config.js file:
  1. Replace the username key with your psql user information.
  1. If your psql connection requires a password, replace the password key with your psql password. If you do not use a password, do nothing.
  1. Replace the host key with your host name. 
  1. The port number is set to the default PostgreSQL server port: 5432. If your port differs from 5432, replace the port key with your PostgreSQL server port number.

1. Build the PostgreSQL database schema

```bash
npm run schema
```

1. Seed the database

```bash
npm run seed_db
```


**Start server on port 3131**
 ```bash
 npm start
 ```

**Run webpack to build main.js file**
 ```bash
 npm run dev-react
 ```
 
## User Notes

When the application is served, you will come to a Log In page. Right now 8 users are set up from User1 to User8 (please note that there is no space between 'User' and the number)

Log in with one of the eight usernames only. No password is required at this time to enter the application.
