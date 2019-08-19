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
const publicKey = 'ASIAZLO737EVW2TSPQYT'; // Update the keys
const secretKey = 'f/+FWmPrmEhc7iQC4HDM8GLtkNzfu9MiCmOelcf+';
const sessionToken = 'FQoGZXIvYXdzEPH//////////wEaDGRrDnvzHV/WKBEoXyL8BK4Y3Shgj4V65n9aJAglWW9OlbPNEMbZfKGchT55aToVCta3eFCKVmivM7iqcYc2R28+NlgnHFebeo7Lgt22f2uwbGG0Ah08iwGtXjPNCxOjfSq4QWJzQAaEe9Uxv8iwgl1aUEmtpl9yM8k16KY8qDFUQvvb1cuBf7pBb4+7IOhBfA0SichTcHZu5wuRExz113AO6qZKCBQnRqxS+bUQjs10IRp2Q/a/qQrti8ZVvVb7ryToTxpueRJm0NULotiR8Cw4FlHi1Uq6aazDY765wEL8JDGuys0XWItsDqjI82/o6q3/ZIJA8Vqn8LdMALiv2Hnyy8HIjr2qzVuV7oB2gKSC8eP/4Er6u2LOEWdvB9uSLlZ7Oh1dJyh48qGPMWww2X+ux2qmelw9f1rOMt1czqN/2vWFGbN7cmVvLCgamhHrRoUrzx1qVozK7/KAabEzlbIQDvkhZKYIDByd6XMFuz4VGaUa43pGfBgYYyZ6Rm0M6oHT8oA0SwGQuZ+N1Ti7T0j3Gk2TcSvqVPbfK7bod79PfAhXHscf1zAGaG012JLUSzht/sNXDOCohTM+SRuaTXvQEFzzd0KNhR9tKJ9nle9y5JJxO0Yly0fYL38uq8nH5qlJzwplayvh/OuzrQdcLfJh9aA6RNEQbm1702nwlUza99U3bV2hOLnxSbQG69BRx9A6YOA2Dse7IQZS4xm1aPfsT4B0DF6Ykndwygsh5EdG6AqkXxBEtIOuqoLbyNzd1T9cW0EzGxpRgxMRdd1GQS8J97Neg48TG2D61yZaRvNQEi6H18/FYdWfd/YsWD+SK60waDdYLqAcIxAYRckGkGQBRtsrrmaK4rybXCjR4eXqBQ==';

const GOOGLE_CLOUD_PROJECT_ID = 'hale-mantra-246416'; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = 'E:\\cloud\\hale-mantra-246416-607d472556bd.json'; // Replace with the path to the downloaded private key

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
