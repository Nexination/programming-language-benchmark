// Use express library
var express = require('express');
// Make two new express handlers
var petShop = express();
var pets = express();
// Use the bodyparser to handle data in express
var bodyParser = require('body-parser')

// Pet data for testing
var petData = {
  "cats": ["Mr. Whiskers"]
  , "dogs": ["Fido", "Rollo"]
};

// Tells express module "pets" to use bodyparser for data
pets.use(bodyParser());

// Defines all the paths to be used by the "pets" module and what to do with those paths
pets.get('/', function(request, response) {
  var pathList = request.originalUrl.split('/');
  console.log(pathList);
  response.status(200).send(JSON.stringify(petData[pathList[1]]));
});
pets.post('/', function(request, response) {
  var pathList = request.originalUrl.split('/');
  console.log(pathList);

  var animals = request.body;

  for(var i = 0; i < animals.length; i += 1) {
    petData[pathList[1]].push(animals[i]);
  };
  response.status(200).send();
});
pets.put('/*', function(request, response) {
  var pathList = request.originalUrl.split('/');
  console.log(pathList);

  var newName = request.body;
  if(petData[pathList[1]][pathList[2]] !== undefined) {
    petData[pathList[1]][pathList[2]] = newName.name;
    response.status(200).send();
  }
  else {
    response.status(404).send();
  };
});
pets.get('/*', function(request, response) {
  var pathList = request.originalUrl.split('/');
  console.log(pathList);
  if(petData[pathList[1]][pathList[2]] !== undefined) {
    response.status(200).send(JSON.stringify(petData[pathList[1]][pathList[2]]));
  }
  else {
    response.status(404).send('');
  };
});

// Defines the top level of the petshop and tells it that if it's cats or dogs, then the express module "pets" should handle it
petShop.use(['/cats', '/dogs'], pets);
petShop.get('/', function(request, response) {
  var petList = [];
  for(var i in petData) {
    petList.push(i);
  };
  response.status(200).send(JSON.stringify(petList));
});

// Sets our petshop server up and to listen on a port and ip
var server = petShop.listen(3000, '0.0.0.0', function () {
  console.log('Pet shop is running at http://' + server.address().address + ':' + server.address().port);
});