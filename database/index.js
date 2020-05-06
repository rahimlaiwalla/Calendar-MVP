const { username, password, host, port } = require('../config.js')

const { Client}  = require('pg');

let client = new Client({
  user: username,
  host: host,
  database: 'ride_share_calendar',
  password: password,
  port: port,
});

client.connect((err) => {
  if (err) {
    console.log('DATABASE IS NOT CONNECTED: ', err);
  } else {
    console.log('database is connected');
  }
});


module.exports = client;