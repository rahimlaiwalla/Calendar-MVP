const db = require('./index.js');
const path = require('path');
const fs = require('fs');


function copyMonthsFunc() {
 
  return new Promise((resolve, reject) => {

    const csvDir = path.join(__dirname, '../csv files')
  
  
    //array of file paths to loop over to query the copy comman
  
    let relativeCsvPaths;
    let monthFilesObj = {};
  
    let months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
  
  
    fs.readdir(csvDir, (err, files) => {
      if(err){
        reject(console.log(error));
      } else {
        relativeCsvPaths = files;
        relativeCsvPaths.forEach((fileName) => {
          let fileTitle = fileName.substring(0, fileName.length - 4);
          if(months.includes(fileTitle)){
            let stringPath = '../csv files/' + fileName;
            monthFilesObj[fileTitle] = path.join(__dirname, stringPath);
          }
        })
        console.log('monthFilesObj: ', monthFilesObj);
        resolve(monthFilesObj);
        
      }
    })
  })
        
};

function loopPromise(monthFilesObj){
  return new Promise((res, rej) => {
    function loop() {
        for(let month in monthFilesObj){
          const copyQuery = `COPY ${month}(day, event_name) FROM '${monthFilesObj[month]}' DELIMITER ',' CSV`;
        
          db.query(copyQuery, (err, data) => {
            if(err){
              rej(console.log('error'))
            } else {
              console.log(data.command, month);
            }
          })
        }
    };
    res(loop())
  })
}


  
      // await asyncFunc
  
  function copyLocationFunc(){

    return new Promise((res, rej) => {
      //copy locations_and_times csv file
      const locationFilesPath = path.join(__dirname, '../csv files/locations_and_times.csv');
  
      const insertLocationFilesPath = `COPY locations_and_times(location_name, location_address, location_city, location_state, location_zip, weekday_start_time, friday_start_time, weekend_start_time) FROM '${locationFilesPath}' DELIMITER ',' CSV`;
      
      db.query(insertLocationFilesPath, (err, data) => {
        if(err){
          rej(console.log(err));
        } else {
          res(console.log(data.command, 'locations_and_times'));
        }
      })
    });
  } 
  
  function insertUsersFunc() {
    
    let users = [
      'User1',
      'User2',
      'User3',
      'User4',
      'User5',
      'User6',
      'User7',
      'User8'
      ];
    return new Promise((res, rej) => {
      //insert users into login table
      
      
      function loopUser(users){

        users.forEach(user => {
          let queryString = `insert into login (username, password) values ('${user}', '${user}');`;
          db.query(queryString, (err, data) => {
            if(err){
              rej(console.log(err));
            } else {
              console.log(data.command, user);
            }
          })
        })
      }
      res(loopUser(users))
    });
  }
  
  
  
  function disconnect() {


        db.end(err => {
          console.log('client has disconnected')
        if (err) {
          console.log('error during disconnection', err.stack)
        }
      })

  };


    copyMonthsFunc().then(loopPromise).then(copyLocationFunc).then(insertUsersFunc)

  
// let promiseArray = [copyMonthsFunc, loopPromise, copyLocationFunc, insertUsersFunc]

// Promise.all(promiseArray).then(() => {console.log('promises done')}).then(disconnect)

