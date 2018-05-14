const express = require('express');
const bodyparser = require("body-parser");
const app = express();
const MongoClient = require('mongodb').MongoClient;

var MongoId = require('mongodb').ObjectID;
var database;

app.use('/', express.static('examples'));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies

app.get('/getCar', function(request, response){
  database.collection('cars').find().toArray((err, cars) => {
    if (err) return console.log(err);
    response.setHeader('Content-Type', 'application/json');
    response.send(cars);
  })
});

app.post('/user', function(req, res){
  req.body._id = null;
  database.collection('users').insert(req.body, function(err, user){
    if (err) return console.log(err);
    res.setHeader('Content-Type', 'application/json');
    res.send(user);
  });
 });

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
  if (err) throw err;

  database = client.db('carrental');
  app.listen(3000, () => console.log('Example app listening on port 3000!'))
}); 