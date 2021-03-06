const express = require('express');
const bodyparser = require("body-parser");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const jwt_secret = 'WU5CjF8fHxG40S2t7oyk';
const jwt_admin = 'SJwt25Wq62SFfjiw92sR';

var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var MongoId = require('mongodb').ObjectID;
var database;

//var bcrypt = require('bcrypt');
//const saltRounds = 10;

app.use('/', express.static('examples'));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({
    extended: true
})); // to support URL-encoded bodies

app.use('/carrental/',function(request,response,next){
  jwt.verify(request.get('JWT'), jwt_secret, function(error, decoded) {      
    if (error) {
      response.status(401).send('Unauthorized access');    
    } else {
      database.collection("users").findOne({'_id': new MongoId(decoded._id)}, function(error, user) {
        if (error){
          throw error;
        }else{
          if(user){
            next();
          }else{
            response.status(401).send('Credentials are wrong.');
          }
        }
      });
    }
  });  
})

app.use('/admin/',function(request,response,next){
    jwt.verify(request.get('JWT'), jwt_admin, function(error, decoded) {      
      if (error) {
        response.status(401).send('Unauthorized access'); 
        console.log(error);   
      } else {
        database.collection("users").findOne({'_id': new MongoId(decoded._id)}, function(error, user) {
          if (error){
            throw error;
          }else{
            if(user){
              next();
            }else{
              response.status(401).send('Credentials are wrong.');
            }
          }
        });
      }
    });  
  })

app.post('/login', function(req, res) {
    var user = req.body;
    database.collection('users').findOne({
        'email': user.email,
        'password': user.password
    }, function(error, user) {
        if (error) {
            throw error;
        } else {
            if(user.type == "admin" && user){
                var token = jwt.sign(user, jwt_admin, {
                    expiresIn: 20000
                });
                res.send({
                    success: true,
                    message: 'Admin Authenticated',
                    token: token,
                    type : 'admin'
                })
                console.log("Authentication passed.");
            }
            else if (user) {
                var token = jwt.sign(user, jwt_secret, {
                    expiresIn: 20000
                });
                res.send({
                    success: true,
                    message: 'Authenticated',
                    token: token,
                    type: "user"
                })
                console.log("Authentication passed.");
            }
            else {
                res.status(401).send('Credentials are wrong.');
            }
        }
    });
});

app.get('/getCar', function(request, response) {
    database.collection('cars').find().toArray((err, cars) => {
        if (err) return console.log(err);
        response.setHeader('Content-Type', 'application/json');
        response.send(cars);
    })
});

/*app.post('/carrental/registeruser', function(req, res, next) {
    req.body._id = null;
    var user = req.body;
    if (user.password == user.password_confirm) {
        bcrypt.hash(user.password, saltRounds, function(err, hash) {
            user.password = hash;
            database.collection('users').insert(user, function(err, data) {
                if (err) return console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.send(user);
            })
        })
    } else {
        console.log("error");
    }
});*/

app.post('/register', function(req, res) {
    req.body.type = "user";
    req.body._id = null;
    var user = req.body;
    database.collection('users').insert(user, function(err, data) {
        if (err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(user);
    })
});

app.get("/singleCar/:car_id", function(req, res) {
    database.collection('cars').findOne({
        _id: new MongoId(req.params.id)
    }, function(err, doc) {
        if (err) {
            handleError(res, err.message, "There is an error in finding a car");
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(doc);
        }
    });
});

app.get("/getSingle/:id", function(req, res){
    database.collection('cars').find({
        _id: new MongoId(req.params.id)
    }).toArray((err, doc) => {
        if(err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(doc);
    });
});

app.post('/admin/addCar', function(req, res){
    req.body._id = null;
    var car = req.body;
    database.collection('cars').insert(car, function(err, data){
        if(err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(car);
    })
});

 app.put('/admin/car/:car_id', function(req, res){    
     database.collection('cars').findAndModify(
        {_id: new MongoId(req.params.car_id)}, // query
        [['_id','asc']],  // sort order
        {$set : {car_name: req.body.car_name, car_price: req.body.car_price, car_year: req.body.car_year, 
            car_engine: req.body.car_engine, car_power: req.body.car_power,
            car_transmission: req.body.car_transmission, car_gears: req.body.car_gears,
            car_doors: req.body.car_doors, car_picture: req.body.car_picture,
            car_min_years: req.body.car_min_years}}, // replacement, replaces only the field "hi"
        function(err, doc) {
            if (err){
                console.warn(err.message);  // returns error if no matching object found
            }else{
                res.json(doc);
            }
        });
 });

 app.delete('/admin/car/:car_id', function(req, res){
     database.collection('cars').remove({_id: new MongoId(req.params.car_id)},
     function(err, data){
         res.json(data);
     });
 });

 app.post('/admin/addEmployee', function(req, res){
    req.body._id = null;
    var employee = req.body;
    database.collection('employees').insert(employee, function(err, data){
        if(err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(employee);
    })
});

app.get('/admin/getEmployee', function(request, response) {
    database.collection('employees').find().toArray((err, employee) => {
        if (err) return console.log(err);
        response.setHeader('Content-Type', 'application/json');
        response.send(employee);
    })
});

app.put('/admin/employee/:employee_id', function(req, res){    
    database.collection('employees').findAndModify(
       {_id: new MongoId(req.params.employee_id)}, // query
       [['_id','asc']],  // sort order
       {$set : {employee_name: req.body.employee_name, employee_salary: req.body.employee_salary, employee_country: req.body.employee_country}}, // replacement, replaces only the field "hi"
       function(err, doc) {
           if (err){
               console.warn(err.message);  // returns error if no matching object found
           }else{
               res.json(doc);
           }
       });
});

app.delete('/admin/employee/:employee_id', function(req, res){
    database.collection('employees').remove({_id: new MongoId(req.params.employee_id)},
    function(err, data){
        res.json(data);
    });
});

app.get('/admin/getUser', function(req, res){
    database.collection('users').find().toArray((err, user) => {
        if(err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(user);
    })
});

app.get('/admin/getEmpExpenses', function(req, res){
    database.collection('employees').aggregate([
        {"$group" : {"_id" : null, "total": {"$sum": '$employee_salary'}}}
    ], function(err, docs){
        if(err) return console.log(err);
        res.send(docs);
    });
});

app.post('/carrental/makeOrder/:car_name/:car_price/:pickup_location/:pickup_date/:pickup_time/:return_location/:return_date/:return_time', function(req, res){
    req.body._id = null;

    var car_name = req.params.car_name;
    var car_price = parseInt(req.params.car_price);
    var pickup_location = req.params.pickup_location;
    var pickup_date = req.params.pickup_date;
    var pickup_time = req.params.pickup_time;
    var return_location = req.params.return_location;
    var return_date = req.params.return_date;
    var return_time = req.params.return_time;
    var order={car_name, car_price, pickup_location, pickup_date, pickup_time, return_location, return_date, return_time};

    database.collection('orders').insert(order, function(err, data) {
        if (err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(order);
    })
});

app.get('/admin/getOrders', function(req, res){
    database.collection('orders').find().toArray((err, order) => {
        if(err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(order);
    })
});

app.get('/admin/getRentIncomes', function(req, res){
    database.collection('orders').aggregate([
        {"$group" : {"_id" : null, "total": {"$sum": '$car_price'}}}
    ], function(err, docs){
        if(err) return console.log(err);
        res.send(docs);
    });
});

app.post('/admin/addManufacturer', function(req, res){
    req.body._id = null;
    var manufacturer = req.body;
    database.collection('manufacturers').insert(manufacturer, function(err, data){
        if(err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(manufacturer);
    })
});

app.put('/admin/manufacturer/:manufacturer_id', function(req, res){    
    database.collection('manufacturers').findAndModify(
       {_id: new MongoId(req.params.manufacturer_id)}, // query
       [['_id','asc']],  // sort order
       {$set : {manufacturer_name: req.body.manufacturer_name, manufacturer_picture: req.body.manufacturer_picture, 
           manufacturer_frontTxt: req.body.manufacturer_frontTxt, manufacturer_backTxt: req.body.manufacturer_backTxt
        }}, // replacement, replaces only the field "hi"
       function(err, doc) {
           if (err){
               console.warn(err.message);  // returns error if no matching object found
           }else{
               res.json(doc);
           }
       });
});

app.delete('/admin/manufacturer/:manufacturer_id', function(req, res){
    database.collection('manufacturers').remove({_id: new MongoId(req.params.manufacturer_id)},
    function(err, data){
        res.json(data);
    });
});

app.get('/getManufacturer', function(request, response) {
    database.collection('manufacturers').find().toArray((err, manufacturers) => {
        if (err) return console.log(err);
        response.setHeader('Content-Type', 'application/json');
        response.send(manufacturers);
    })
});

app.post('/sendmail', function(request, response){
    var email = request.body;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'm.hadzimehanovic@gmail.com',
          pass: '062116767mujo'
        }
      });
      
      var mailOptions = {
        from: 'm.hadzimehanovic@gmail.com',
        to: email.email,
        subject: email.subject,
        text: 'Name: ' + email.name + '\n' +email.body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          response.send(info);
        }
      });
});

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
    if (err) throw err;

    database = client.db('carrental');
    app.listen(3000, () => console.log('Example app listening on port 3000!'))
});