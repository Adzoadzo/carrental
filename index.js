const express = require('express');
const bodyparser = require("body-parser");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const jwt_secret = 'WU5CjF8fHxG40S2t7oyk';

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

app.use('/carrental/', function(req, res, next) {
    jwt.verify(req.get('JWT'), jwt_secret, function(error, decoded) {
        if (error) {
            res.status(401).send('Unauthorized access');
        } else {
            database.collection('users').findOne({
                '_id': new MongoId(decoded._id)
            }, function(error, user) {
                if (error) {
                    throw error;
                } else {
                    if (user) {
                        next();
                    } else {
                        res.status(401).send('Credentials are wrong.');
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
            if (user) {
                var token = jwt.sign(user, jwt_secret, {
                    expiresIn: 20000
                });
                res.send({
                    success: true,
                    message: 'Authenticated',
                    token: token
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

app.post('/addCar', function(req, res){
    req.body._id = null;
    var car = req.body;
    database.collection('cars').insert(car, function(err, data){
        if(err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(car);
    })
});

 app.put('/car/:car_id', function(req, res){    
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

 app.delete('/car/:car_id', function(req, res){
     database.collection('cars').remove({_id: new MongoId(req.params.car_id)},
     function(err, data){
         res.json(data);
     });
 });

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
    if (err) throw err;

    database = client.db('carrental');
    app.listen(3000, () => console.log('Example app listening on port 3000!'))
});