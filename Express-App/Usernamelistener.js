var express = require('express');
var app = express();
var cors = require('cors');
var fs = require('fs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var busboy = require('connect-busboy');
var zipcodes = require('zipcodes');
const AWS = require('aws-sdk');
const {Storage} = require('@google-cloud/storage');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use(busboy());

const validnumber = RegExp((/^[0-9]+$/));
const validletter = RegExp((/^[A-Za-z]+$/));
const publicKey = 'ASIAZLO737EV3TVLHEXB'; // Update the keys
const secretKey = 'TeL41BsvyJDy6Zg5ZXRBqNLi2WT1Ieu6JEnhxDMr';
const sessionToken = 'FQoGZXIvYXdzEAMaDPMgdk7851i/42GsJiL8BBPje3Z7n0dGeVKBIBMMyWnJXrVOByuy/kh3P1piQyXov8WND4LSpQbMZYmyKt07CwN0Q7Qyi+4BA0w7d8xDZady6L0v8RqmdlaFPfTofKbwLWG34bCVF6rHR7ZDLHyle8WQzynVTIwEXgMULXe4kuD8X6tnprP8D4XVLuAC1fO7NrD5qOrfoBetc6Yfg4yQT8NI6c1HC49SmXHWaaSy9YCmMwcgyIbzLRg+IOZicNXTF7IonQzFzR78o9bZKzcO8ADlAxzEXUOv9YHr1g7G8AMaNpLsNqJHWW48s7r9IHg7CizD7kIe1EsCA/lSxlIC6mUSwst64pVzvcR6tDAOYjoZaAeNOKzgvOiv4gyDGk4iaV0yhLR8jeVOENN/r5nbw7sx/lPdVXr/hmP2tiQD0zZj6QZqmOKrsx4feloOq7RggUqNFNxcsIu48hZTCdGGsj3AG49WfrC32Xq3vDqFvlhS9iw5tC2BC4wUFkGjoFSCgrCmPZVT6UvSgscziTNJccvrdVdd6bYYSv/d2Pg51SZ5j+uOYd1joZaiGX+PiDL3rVBfJnDSHmDkZKuCvc7Uqvu6a00dUADlMigQAd+AmUGY56Lwtqej+Za5L/XetghduKO8C+iEv4A/K1Ifik2pakODP7QJc1nbvo5CM8BsQpGuBCkZCbp8J26iG7sjJAnuoVW+vSVT0UJXllRPl82gaKyXc6He2O0JXf+ajuu4xxAOH257SCg1IC99Pf34iUaE62T7vOf6vfwSws7TiuY7XMjH+YAgVS7rfos/XhEpm6pLOMo+2H7KJVXnFSYE3vwRHcAIn+X2FuvofROne4aTKa4j8h7CU6ybelVcOSim3+nqBQ==';

const GOOGLE_CLOUD_PROJECT_ID = 'hale-mantra-246416'; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = 'hale-mantra-246416-607d472556bd.json'; // Replace with the path to the downloaded private key

const s3 = new AWS.S3(
 {accessKeyId: publicKey, secretAccessKey: secretKey, sessionToken: sessionToken}
);
const storage = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
  });

var con = mysql.createConnection({
  host: "database-1.ccw3j3wrkgow.us-east-1.rds.amazonaws.com", user: "vedha",
  password: "abcgokul123",
  port: "3306",
  database: "innodb"
});
var todaysDate = new Date();

app.post('/', function(req , res){
  var hills = zipcodes.lookup(req.body.zip);
  if((req.body.pname==="")||(req.body.zip==="")||(req.body.phone==="")){
    res.send("false");
  }
  else{
    fs.appendFile('mynamefile.txt',JSON.stringify(req.body),function (err){
      if (err) throw err;
      console.log('saved!!!');
    });
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      try{
        con.query("insert into shipping values(?,?,?,?)", [req.body.pname,req.body.zip,req.body.phone,hills.city],function (err, result) {
          console.log("Database created");
          console.log(result);
        });
      }
      catch(err){
        console.log(err);
      }
      finally{
        con.end();
      }
      });
    res.send('true');
  }
})

app.post('/checkpname',function(req , res){
  res.send(validletter.test(req.body.val)?"true":"false")
})

app.post('/numbers',function(req , res){
  res.send(validnumber.test(req.body.val)?"true":"false")
})

app.post('/checkcountry',function(req , res){
  res.send(req.body.val=="Select a Country"?"false":"true")
})
app.post('/checkzip',function(req , res){
  res.send(validnumber.test(req.body.val)&&(req.body.val.length==5)?"true":"false")
})
app.post('/checkphone',function(req , res){
  res.send((validnumber.test(req.body.val))&&(req.body.val.length==10)?"true":"false")
})
app.post('/checkdate',function(req , res){

  res.send(new Date(req.body.val)<todaysDate?"true":"false")
})
app.post('/fileupload', function(req, res) {
    var fstream,responce=false;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        const params = {
          Bucket: 'sgokul2700',
          Key: (filename),
          Body: file
        };
         fstream = fs.createWriteStream(filename);
         file.pipe(fstream);
        s3.upload(params, function(s3Err, data) {
          if (s3Err) {
              console.log("Error uploading data: ", s3Err);
            } else {
              console.log("Successfully uploaded data");
            }
        });
        storage.bucket('sgokul2700').upload(filename,function(s3Err, data) {
          if (s3Err) {
              console.log("Error uploading data: ", s3Err);
            } else {
              console.log("Successfully uploaded data");
            }
          });
        responce=true;
    });
    req.busboy.on('finish', function () {
        res.send(responce);
    });

})
app.post('/checkfile',function(req , res){
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
      console.log(filename);
      res.send(true);
  });
  req.busboy.on('finish', function () {
      res.send(false);
  });

})


//start your server on port 3001
app.listen(3001, () => {
  console.log('Server started');
});
