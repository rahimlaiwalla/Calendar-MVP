const db = require('./index.js');
const path = require('path');
const fs = require('fs');


function insertUsersFunc() {
  
  return new Promise((res, rej) => {
    //insert users into login table
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
    
    


    for(let i = 0; i < users.length; i++){
      if(i < users.length - 1){
      let queryString = `insert into login (username, password) values ('${users[i]}', '${users[i]}');`;
      db.query(queryString, (err, data) => {
        if(err){
          rej(console.log(err));
        } else {
          console.log(data.command, users[i]);
        }
      })
      } else if (i === users.length - 1){
        let queryString = `insert into login (username, password) values ('${users[i]}', '${users[i]}');`;
        db.query(queryString, (err, data) => {
          if(err){
            rej(console.log(err));
          } else {
            console.log(data.command, users[i]);
            res('users inserted')
          }
        })
      }
    }
  });
}

function copyLocationFunc(value){

  return new Promise((res, rej) => {
    //copy locations_and_times csv file
    const locationFilesPath = path.join(__dirname, '../csv files/locations_and_times.csv');

    const insertLocationFilesPath = `COPY locations_and_times(location_name, location_address, location_city, location_state, location_zip, weekday_start_time, friday_start_time, weekend_start_time) FROM '${locationFilesPath}' DELIMITER ',' CSV`;
    
    db.query(insertLocationFilesPath, (err, data) => {
      if(err){
        rej(console.log(err));
      } else {
        console.log(data.command, 'locations_and_times');
        res('locations and times inserted after ' + value)
      }
    })
  });
} 

function readCsvFileFunc(value) {
 
  return new Promise((resolve, reject) => {

    const csvDir = path.join(__dirname, '../csv files')
  
  
    let relativeCsvPaths;
    let monthFilesArray = [];
  
    let months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
  
  
    fs.readdir(csvDir, (err, files) => {
      if(err){
        reject(console.log(error));
      } else {
        relativeCsvPaths = files;
        relativeCsvPaths.forEach((fileName) => {
          let fileTitle = fileName.substring(0, fileName.length - 4);
          if(months.includes(fileTitle)){
            let obj = {}
            let stringPath = '../csv files/' + fileName;
            obj.month = fileTitle
            obj.file_path = path.join(__dirname, stringPath);
            monthFilesArray.push(obj);
          }
        })
        // console.log('monthFilesArray: ', monthFilesArray);
        resolve(monthFilesArray);
        
      }
    })
  })
        
};

function copyMonths(monthFilesArray){
  return new Promise((res, rej) => {

    for(let i = 0; i < monthFilesArray.length; i++){
      if(i < monthFilesArray.length - 1){
        let copyQuery = `COPY ${monthFilesArray[i].month}(day, event_name) FROM '${monthFilesArray[i].file_path}' DELIMITER ',' CSV`;
      
        db.query(copyQuery, (err, data) => {
          if(err){
            rej(console.log('error in copying months'))
          } else {
            console.log(data.command, monthFilesArray[i].month);
          }
        })
      } else if ( i === monthFilesArray.length - 1){
        let copyQuery = `COPY ${monthFilesArray[i].month}(day, event_name) FROM '${monthFilesArray[i].file_path}' DELIMITER ',' CSV`;
      
        db.query(copyQuery, (err, data) => {
          if(err){
            rej(console.log('error'))
          } else {
            console.log(data.command, monthFilesArray[i].month);
            res('month csvs coppied into db')
          }
        })
      }
    }
  })
}


  

  
  
  
  
  
  function disconnect(value) {
    if(value){
      db.end(err => {
        if (err) {
          console.log('error during disconnection', err.stack)
        } else {
          console.log('client disconnnected')
        }
      })
    } else {
      console.log('promised did not follow order')
    }
  };


  
  
insertUsersFunc()
  .then((result) => copyLocationFunc(result))
  .then((result) => readCsvFileFunc(result))
  .then((result) => copyMonths(result))
  .then((result) => disconnect(result))
  .catch(() => {throw new Error('Error in promise flow')})

