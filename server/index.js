const express  = require('express');
const bodyparser = require('body-parser');
const db = require('../database/index.js');
const config = require('../config.js')
const cors = require('cors');
const Axios = require('axios');

const PORT = 3131;

var app = express();

app.use(bodyparser());

app.use(cors());

app.use(express.static(__dirname + '/../client/dist'));

app.get('/events', (req, res) => {
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
            // console.log('data.rows: ', data.rows)
            // console.log('Array from /riders: ', array)
            res.send(array)
        }
    })
})

// app.post('/registerDriver', (req, res) => {
//     let registrar = req.body
//     queryString = `insert into userInfo(day_id, name, status, no_of_passengers, add_number, address, zip_code) values (${registrar.day_id}, '${registrar.name}', '${registrar.driver}', ${registrar.passengers}, ${registrar.add_number}, '${registrar.address}', ${registrar.zip_code});`
//     db.query(queryString, (err, data) => {
//         if(err){
//             res.send(err)
//         } else {
//             // console.log(req.body)
//             let add_num = registrar.add_number;
//             let address = registrar.address;
//             let zipCode = registrar.zip_code;
//             //gets coordinates from inputted address
//             let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${add_num}+${address},+${zipCode}&key=${config.geocodeAPI_Key}`
//             console.log(url)
//             Axios.get(url)
//                 .then((response) => {
//                     console.log(response.data.results[0].geometry.location);
//                     res.send(response.data.results[0].geometry.location)
//                 })
        
//         }
//     })
// })

app.post('/registerDriver', (req, res) => {
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
          
          queryString = `insert into userInfo(day_id, name, status, no_of_passengers, add_number, address, zip_code, latitude, longitude) values (${registrar.day_id}, '${registrar.name}', '${registrar.driver}', ${registrar.passengers}, ${registrar.add_number}, '${registrar.address}', ${registrar.zip_code}, ${latitude}, ${longitude});`
          db.query(queryString, (err, data) => {
              if(err){
                res.send(err)
              } else {
                res.send('driver inserted into db.')
              }
          })
      })
})


app.post('/registerPassenger', (req, res) => {
    let registrar = req.body
    queryString = `insert into userInfo(day_id, name, status, no_of_passengers, add_number, address, zip_code) values (${registrar.day_id}, '${registrar.name}', '${registrar.driver}', ${registrar.passengers}, ${registrar.add_number}, '${registrar.address}', ${registrar.zip_code});`
    db.query(queryString, (err, data) => {
        if(err){
            res.send(err)
        } else {
            res.send(req.body)
        }
    })
})


app.listen(PORT, () => console.log('Express server started on ', PORT));