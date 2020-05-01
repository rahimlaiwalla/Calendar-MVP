require('dotenv').config();

const Twilio = require('twilio')
const express  = require('express');
const bodyparser = require('body-parser');
const db = require('../database/index.js');
const config = require('../config.js')
const cors = require('cors');
const Axios = require('axios');
const Chance = require('chance')

const PORT = 3131;

var app = express();

app.use(bodyparser());

app.use(cors());

app.use(express.static(__dirname + '/../dist'));

const AccessToken = Twilio.jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant
const chance = new Chance()

app.get('/token/:id', function (req, res) {
  //create token object with account info to project
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
  )
  //give the token an name (can use username of chatter, instead of random)
  token.identity = req.params.id;
  // token.identity = chance.name();
  //add chat grant to token
  token.addGrant(new ChatGrant({
    serviceSid: process.env.TWILIO_CHAT_SERVICE_SID
  }))
  //return JSON object back to client
  res.send({
    identity: token.identity,
    token: token.toJwt()
  })
})


app.get('/events/:id', (req, res) => {
    let id = 1;
    const locationInfo = {};
    let novemberArray = [];
    db.query(`select * from locations_and_times where location_zip = '${94501}'`, (err, data) => {
       if(err){
           res.send(err)
       } else {
        //  console.log('/events data.rows: ', data.rows);
        locationInfo.weekday = data.rows[0].weekday_start_time;
        locationInfo.friday = data.rows[0].friday_start_time;
        locationInfo.weekend = data.rows[0].weekend_start_time;
        // console.log('LOCATION INFO: ', locationInfo)
        db.query('select * from november', (err, data) => {
            if(err){
                res.send(err)
            } else {
                let november = data.rows;
                // console.log('NOVEMBER: ', november)
                // let novemberArray = [];
                november.forEach( (novemberDay) => {
                    // console.log('DAY.EVENT_NAME: ', novemberDay.event_name)
                    if(novemberDay.event_name !== 'null') {
                        let dayObj = {};
                        dayObj.id = id;
                        dayObj.title = novemberDay.event_name;
                        let year = 2019;
                        let month = 10;
                        let day = novemberDay.day;
                        let time = '';
                        if(new Date(year, month, day).getDay() < 5){
                            time = locationInfo.weekday;
                        } else if(new Date(year, month, day).getDay() === 5){
                            time = locationInfo.friday;
                        } else if(new Date(year, month, day).getDay() > 5){
                            time = locationInfo.weekend
                        }
                        let meridiem = time.substring(5, 7);
                        let hour = 0;
                        if(meridiem === 'pm'){
                            hour = +time.substring(0, 1) + 12;
                        } else {
                            hour = +time.substring(0, 1)
                        }
                        let minute = +time.substring(2, 4);

                        let start = new Date(year, month, day, hour, minute, 0);
                        dayObj.start = start;
                        dayObj.end = new Date(year, month, day, hour+2, minute, 0);
                        dayObj.allDay = false;
                        novemberArray.push(dayObj);
                    }
                    id = id + 1;
                })
            }
            // console.log('NOVEMBER ARRAY: ', novemberArray)
            // console.log('NOVEMBER OBJ: ', novemberObj);
            res.send(novemberArray)
        })
      }
    })
});

app.get('/messages/:id/:driverName', (req, res) => {
  // console.log('req.params get request messages api: ', req.params);
  // res.send('messages api called')

  db.query(`select message from messages where day_id = ${req.params.id} and driver_username = '${req.params.driverName}'`, (err, data) => {
    if(err){
      res.send(err)
    } else {
      console.log('data from messages query: ', data.rows)
      res.send(data.rows);
    }
  })
})

app.post('/insertMessage/:id/:driverName', (req, res) => {
  db.query(`insert into messages(day_id, driver_username, message) values (${req.params.id}, '${req.params.driverName}', '${req.body.message}')`, (err, data) => {
    if(err){
      res.send(err);
    } else {
      db.query(`select message from messages where day_id = ${req.params.id} and driver_username = '${req.params.driverName}'`, (err, data) => {
        if(err){
          res.send(err);
        } else {
          res.send(data.rows);
        }
      })
    }
  })
})

app.post('/messages/:id/:driverName', (req, res) => {
  db.query(`update messages set message = '${req.body.message}' where day_id = ${req.params.id} and driver_username = '${req.params.driverName}'`, (err, data) => {
    if(err){
      res.send(err);
    } else {
      db.query(`select message from messages where day_id = ${req.params.id} and driver_username = '${req.params.driverName}'`, (err, data) => {
        if(err){
          res.send(err);
        } else {
          res.send(data.rows);
        }
      })
    }
  })
})

app.post('/login', (req, res) => {
  // exists syntax: select login_id from login where exists (select 1 from login where username = '${req.body.username}')
  db.query(`select login_id from login where username = '${req.body.username}'`, (err, data) => {
    if(err){
      res.send(err);
    } else {
      // console.log(data.rows[0].login_id);
      res.send(data.rows[0]);
    }
  })
})

app.post('/riders', (req, res) => {
    // console.log(req.body)
    db.query(`select * from userInfo where day_id = ${req.body.day_id}`, (err, data) => {
        if(err){
            res.send(err)
        } else {
            let array = [[], []];
            
            data.rows.forEach((user) =>{
                if(user.status === 'driver'){
                    array[0].push(user);
                    
                } else{
                    array[1].push(user);
                }
            })
            console.log('data.rows: ', data.rows)
            console.log('Array from /riders: ', array)
            // place passengers in driver groups and make drivers groups
            let groups = [];
            array[0].forEach( driver => {
              let group = {};
              group['driver'] = driver;
              group['passenger'] = [];
              groups.push(group);
            })
            if(groups.length > 0){
              let j = 0;
              for(let i = 0; i < array[1].length; i++){
                if(j === groups.length - 1){
                  groups[j].passenger.push(array[1][i]);
                  j = 0;
                } else {
                  groups[j].passenger.push(array[1][i]);
                  j++;
                }
              }
            }
            
            let sendObj = {array: array, groups: groups};
            console.log('SENDOBJ: ', sendObj);
            res.send(sendObj);
        }
    })
})

app.post('/registerDriver/:id', (req, res) => {
  let registrar = req.body
  // console.log(req.body)
  let add_num = registrar.add_number;
  let address = registrar.address;
  let zipCode = registrar.zip_code;
  let latitude;
  let longitude;
  //gets coordinates from inputted address
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${add_num}+${address},+${zipCode}&key=${config.geocodeAPI_Key}`
  // console.log(url)
  Axios.get(url)
      .then((response) => {
          // console.log(response.data.results[0].geometry.location);
          // res.send(response.data.results[0].geometry.location)
          latitude = response.data.results[0].geometry.location.lat;
          longitude = response.data.results[0].geometry.location.lng;
          
          queryString = `insert into userInfo(userid, day_id, name, status, no_of_passengers, add_number, address, zip_code, latitude, longitude) values (${registrar.userId}, ${registrar.day_id}, '${registrar.name}', '${registrar.driver}', ${registrar.passengers}, ${registrar.add_number}, '${registrar.address}', ${registrar.zip_code}, ${latitude}, ${longitude});`
          db.query(queryString, (err, data) => {
              if(err){
                res.send(err)
              } else {
                res.send('driver inserted into db.')
              }
          })
      })
})


app.post('/registerPassenger/:id', (req, res) => {
    let registrar = req.body
    let add_num = registrar.add_number;
    let address = registrar.address;
    let zipCode = registrar.zip_code;
    let latitude;
    let longitude;
    let distances = [];

    let drivers = registrar.usersArray[0];
    

    //gets coordinates from inputted address
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${add_num}+${address},+${zipCode}&key=${config.geocodeAPI_Key}`
    Axios.get(url)
    .then((response) => {
        // console.log(response.data.results[0].geometry.location);
        // res.send(response.data.results[0].geometry.location)
        latitude = response.data.results[0].geometry.location.lat;
        longitude = response.data.results[0].geometry.location.lng;

        queryString = `insert into userInfo(userid, day_id, name, status, no_of_passengers, add_number, address, zip_code, latitude, longitude) values (${registrar.userId}, ${registrar.day_id}, '${registrar.name}', '${registrar.driver}', ${registrar.passengers}, ${registrar.add_number}, '${registrar.address}', ${registrar.zip_code}, ${latitude}, ${longitude});`
        db.query(queryString, (err, data) => {
            if(err){
              res.send(err)
            } else {
              console.log('passenger inserted into db.')
              res.send('passenger inserted into db.')
            }
        })

        // drivers.forEach( driver => {
        //   let distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${latitude},${longitude}&destinations=${driver.latitude},${driver.longitude}&key=${config.geocodeAPI_Key}`
        //   Axios.get(distanceUrl)
        //     .then( response => {
        //       console.log('response: ', response)
        //       // distances.push(response.data.rows[0].elements[0].distance.value)
        //     })
        //     .catch( error => {
        //       console.log(error);
        //     })
        // })
        // console.log('distances from /registerpassenger: ', distances)
        // res.send('loop complete')
    })
})


app.listen(PORT, () => console.log('Express server started on ', PORT));