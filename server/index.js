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


//Login route
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


//get event information for each day
app.get('/events/:id', (req, res) => {
    let monthsArray = ['november', 'december', 'january']
    //id in route, above, is user id, to show user id url
    //what is this id, below, for?
    let id = 1;
    const locationInfo = {};
    //should I place this array in the query selecting from the month, in order to create more arrays for more months?
    //or should I have this be a general array that the calendar can parse through
    let eventsArray = [];
    db.query(`select * from locations_and_times where location_zip = '${94501}'`, (err, data) => {
      if(err){
        res.send(err)
      } else {
        //  console.log('/events data.rows: ', data.rows);
        locationInfo.weekday = data.rows[0].weekday_start_time;
        locationInfo.friday = data.rows[0].friday_start_time;
        locationInfo.weekend = data.rows[0].weekend_start_time;
        // console.log('LOCATION INFO: ', locationInfo)
        
        let year = 2019;
        let month = 10;

//////////////////////PLACE FOR LOOP HERE TO LOOP THROUGH ALL MONTHS///////////////////////////////////////
/* This code needs to be changed to async await */
        for(let i = 0; i < monthsArray.length; i++){
          // if(monthsArray[i] === 'january'){
          //   year++;
          //   month = 0;
          // }
          if(i < monthsArray.length - 1){
            db.query(`select * from ${monthsArray[i]}`, (err, data) => {
              if(err){
                  res.send(err)
              } else {
                  console.log(monthsArray[i])
                  let monthData = data.rows;
                  // console.log('monthData: ', monthData)
                  // let eventsArray = [];
                  monthData.forEach( (dayOfMonth) => {
                      // console.log('day of month: ', dayOfMonth)
                      if(dayOfMonth.event_name !== 'null') {
                          let dayObj = {};
                          //id variable from above is being assigned here to identify event information for the first event in november
                            //I should make this more specific, ex: 11_2019_1
                          dayObj.id = id;
                          dayObj.title = dayOfMonth.event_name;
                          //maybe move year and month outside the scope, in order to alter them when year and month changes
                          let day = dayOfMonth.day;
                          // console.log('day: ', day)
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
                          // console.log('start: ', start)
                          dayObj.start = start;
                          dayObj.end = new Date(year, month, day, hour+2, minute, 0);
                          dayObj.allDay = false;
                          eventsArray.push(dayObj);
                      }
                      id = id + 1;
                      
                    })
                    if(month === 11){
                      month = 0;
                      year = year + 1;
                    } else {
                      month = month + 1
                    }
                    console.log('month: ', month)
                }
            })
          } else if (i === monthsArray.length - 1){
            db.query(`select * from ${monthsArray[i]}`, (err, data) => {
              if(err){
                  res.send(err)
              } else {
                console.log(monthsArray[i])
                  let monthData = data.rows;
                  // console.log('monthData: ', monthData)
                  // let eventsArray = [];
                  monthData.forEach( (dayOfMonth) => {
                      // console.log('day of month: ', dayOfMonth)
                      if(dayOfMonth.event_name !== 'null') {
                          let dayObj = {};
                          //id variable from above is being assigned here to identify event information for the first event in november
                            //I should make this more specific, ex: 11_2019_1
                          dayObj.id = id;
                          dayObj.title = dayOfMonth.event_name;
                          //maybe move year and month outside the scope, in order to alter them when year and month changes
                          let day = dayOfMonth.day;
                          // console.log('day: ', day)
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
                          // console.log('start: ', start)
                          dayObj.start = start;
                          dayObj.end = new Date(year, month, day, hour+2, minute, 0);
                          dayObj.allDay = false;
                          eventsArray.push(dayObj);
                      }
                      id = id + 1;
                      
                      
                    })
                    if(month === 11){
                      month = 0;
                      year = year + 1;
                    } else {
                      month = month + 1
                    }                    console.log('month: ', month)
                    res.send(eventsArray)
                }
            })
          }
        }
      }
    })
});


/*retrieve all passenger data for the specific day, organize into car groups, compare passenger pick up 
preference to pick up locations, using google distance matrix api, and automatically place passengers
into car with the shortest distance from passenger*/
app.post('/riders', (req, res) => {
  // console.log(req.body)
  //get all users registered as drivers or passengers on specific day
  db.query(`select * from userInfo where day_id = ${req.body.day_id}`, (err, data) => {
    if(err){
        res.send(err)
    } else {
        let array = [[], []];
        //sort drivers into array in 0 index, and passengers into the array in the 1 index
        data.rows.forEach((user) =>{
            if(user.status === 'driver'){
                array[0].push(user);
                
            } else{
                array[1].push(user);
            }
        })
        // console.log('data.rows: ', data.rows)
        // console.log('Array from /riders: ', array)
        // place passengers in driver groups and make drivers groups
        let groups = [];

        ///////////////////////////////////////////////////////////////////////////////////////////
        //now, need to organize cars by placing passengers into groups with a driver
        //loop through drivers and create groups organized by drivers. will produce array of objects
        array[0].forEach( driver => {
          let group = {};
          group['driver'] = driver;
          group['passenger'] = [];
          groups.push(group);
        })
        // console.log('groups in /riders: ', groups);

        //for each passenger, I want to compare each passenger distance to each driver, find the smallest distance, and assign passenger to driver
        //loop through passenger array array[1]

        if(array[1].length > 0){
          array[1].forEach( passenger => {
            //assign distance array to variable
            let distances = [];
            //loop through group
            //query passenger lat and long to driver (group[i].driver) lat and long, and push into array. (the for loop from registerpassenger/:id route)

            async function getDistances(groups, passenger){
              for(let i = 0; i < groups.length; i++){
                console.log('i: ', i)
                let stop = groups.length - 1

                //function to access distance matrix api, asynchronously, to keep loop async
                function distanceInLoop(group, passenger, i, stop){
                  let distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${passenger.latitude},${passenger.longitude}&destinations=${group.driver.latitude},${group.driver.longitude}&units=imperial&key=${config.geocodeAPI_Key}`
                  Axios.get(distanceUrl)
                    .then( response => {
                      let distance = response.data.rows[0].elements[0].distance.text;
                      console.log(`typeof distance from passenger to driver ${i}: ${typeof(distance.substring(0, distance.length - 3))}`);
                      distances.push(+(distance.substring(0, distance.length - 3)));
                      if(i === stop){
                      console.log('distances: ', distances);
                      //find index of smallest value in the distance array
                      let minIndex = distances.indexOf(Math.min(...distances));
                      console.log('minIndex: ', minIndex)
                      //insert passenger information into passenger array in group at the same index as min index
                      //push passenger into passenger array (group[i].passenger) of group at the index = index from distance array
                      groups[minIndex].passenger.push(passenger);
                      console.log('groups no. 2: ', groups)
                      let sendObj = {array: array, groups: groups};
                      console.log('SENDOBJ: ', sendObj);
                      return (res.send(sendObj));
                      
                    } else {

                      return;                    
                    }
                  })
                  .catch( error => {
                    return error;
                  })
                }
                //call above function with await
                await distanceInLoop(groups[i], passenger, i, stop);
              }
              // add return statement here somehow, currently this is not asynchronously being called
              // console.log('return')
              // return;
            }

            getDistances(groups, passenger);
          })
        } else {
        let sendObj = {array: array, groups: groups};
        console.log('SENDOBJ: ', sendObj);
        res.send(sendObj);           
        }

    }
  })
});


//post request to insert driver information into db, and obtain coordinate and map information via geocode api
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

//post request to register passenger information into db, and obtain coordinate and map information via geocode api
app.post('/registerPassenger/:id', (req, res) => {
    let registrar = req.body
    let add_num = registrar.add_number;
    let address = registrar.address;
    let zipCode = registrar.zip_code;
    let latitude;
    let longitude;
    let distances = [];

    let drivers = registrar.usersArray[0];
    console.log('driver: ', drivers)
    

    //gets coordinates from inputted address
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${add_num}+${address},+${zipCode}&key=${config.geocodeAPI_Key}`
    Axios.get(url)
    .then((response) => {
        // console.log(response.data.results[0].geometry.location);
        // res.send(response.data.results[0].geometry.location)
        latitude = response.data.results[0].geometry.location.lat;
        longitude = response.data.results[0].geometry.location.lng;

        //insert passenger info into database
        queryString = `insert into userInfo(userid, day_id, name, status, no_of_passengers, add_number, address, zip_code, latitude, longitude) values (${registrar.userId}, ${registrar.day_id}, '${registrar.name}', '${registrar.driver}', ${registrar.passengers}, ${registrar.add_number}, '${registrar.address}', ${registrar.zip_code}, ${latitude}, ${longitude});`
        db.query(queryString, (err, data) => {
            if(err){
              res.send(err)
            } else {
              console.log('passenger inserted into db.')
              res.send('passenger inserted into db.')
            }
        })
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

          // for(let i = 0; i < drivers.length; i++){
          //   if( i < drivers.length - 1){
          //     let distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${latitude},${longitude}&destinations=${drivers[i].latitude},${drivers[i].longitude}&units=imperial&key=${config.geocodeAPI_Key}`
          //     Axios.get(distanceUrl)
          //       .then( response => {
          //         console.log(`distance from passenger to driver ${i}: ${response.data.rows[0].elements[0].distance.text}`)
          //         distances.push(response.data.rows[0].elements[0].distance.text)
          //       })
          //       .catch( error => {
          //         console.log(error);
          //       })
          //   } else if (i === drivers.length - 1){
          //     let distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${latitude},${longitude}&destinations=${drivers[i].latitude},${drivers[i].longitude}&units=imperial&key=${config.geocodeAPI_Key}`
          //     Axios.get(distanceUrl)
          //       .then( response => {
          //         console.log(`distance from passenger to driver ${i}: ${response.data.rows[0].elements[0].distance.text}`)
          //         distances.push(response.data.rows[0].elements[0].distance.text)
          //         console.log(distances);
          //         res.send(distances);
          //       })
          //       .catch( error => {
          //         console.log(error);
          //       })
          //   }
          // }
 

 /////////////////////////////////////////////////////////////////////////////////////////////////       
    })
})

//Twilio Chat Route
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

///////////////////ROUTES FOR DRIVER MESSAGE (NO LONGER BEING USED - REPLACED BY TWILIO CHAT)/////////////
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => console.log('Express server started on ', PORT));