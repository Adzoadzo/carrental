const express = require('express');
const app = express();

var mongo = require('mongojs');
var db = mongo('localhost:27017/carrental', ['users'])

var body_parser = require('body-parser');
app.use(body_parser.json());

app.use('/', express.static('examples'));

app.get('/users', function(req, res){
    db.users.find(function(err, docs){
     res.json(docs);
   });
  });

app.post('/user', function(req, res){
    req.body._id = null;
    db.users.insert(req.body, function(err, doc){
     res.json(doc);
    });
 });

app.listen(3000, () => console.log('Car rental app is listening on port 3000!'));