const { Client}  = require('pg');

const client = new Client({
  user: 'rahimlaiwalla',
  host: 'localhost',
  database: 'ride_share_calendar',
  password: '',
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.log('DATABASE IS NOT CONNECTED: ', err);
  } else {
    console.log('database is connected');
  }
});


module.exports = client;