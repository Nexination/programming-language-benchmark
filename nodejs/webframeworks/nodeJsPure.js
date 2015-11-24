// Use built in library http
var http = require('http');

// Pet test data
var pets = {
  "cats": ["Mr. Whiskers"]
  , "dogs": ["Fido", "Rollo"]
};

// Constants that contain the port and address for the server
const PORT=3000;
const IP='0.0.0.0';

// Function that handles all requests to our petshop
var handlePets = function(request, response) {
  // Creates a variable and fills it with data until the end
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  // Once data ends, we process it through our petInterface
  request.on('end', function() {
    petInterface.process(request, response, data);
  });
};

// Pet interface we use to process our data
var petInterface = new function() {
  // Binds a local variable to the petInterface function "this"
  var main = this;
  // Showcases which types of animals the pet store has
  this.top = function(request, response, data) {
    var petList = [];
    for(var i in pets) {
      petList.push(i);
    };
    main.respond(response, 200, JSON.stringify(petList));
  };
  // Shows all pets in a specific catergory
  this.petsShow = function(request, response, data) {
    var pathList = request.url.split('/');
    main.respond(response, 200, JSON.stringify(pets[pathList[1]]));
  };
  // Shows a specific pet by id in that specific category
  this.petShow = function(request, response, data) {
    var pathList = request.url.split('/');
    if(pets[pathList[1]][pathList[2]] !== undefined) {
      main.respond(response, 200, JSON.stringify(pets[pathList[1]][pathList[2]]));
    }
    else {
      main.respond(response, 404);
    };
  };
  // Adds one or more pets from a JSON array
  this.petAdd = function(request, response, data) {
    var pathList = request.url.split('/');
    var animals = JSON.parse(data);

    for(var i = 0; i < animals.length; i += 1) {
      pets[pathList[1]].push(animals[i]);
    };
    main.respond(response, 200);
  };
  // Changes the name of one specific pet with data from a JSON object
  this.petChange = function(request, response, data) {
    var pathList = request.url.split('/');

    var newName = JSON.parse(data);
    if(pets[pathList[1]][pathList[2]] !== undefined) {
      pets[pathList[1]][pathList[2]] = newName.name;
      main.respond(response, 200);
    }
    else {
      main.respond(response, 404);
    };
  };

  // A response function that simplifies how to respond
  this.respond = function(response, responseCode, responseText) {
    if(responseText === undefined) {
      responseText = '';
    };
    response.writeHead(responseCode, {'Content-Type': 'application/json'});
    response.end(responseText);
  };

  // Proccesses all incoming data and uses the below petMap to send the data to the correct function or do default replies
  this.process = function(request, response, data) {
    console.log(request.method + ': ' + request.url);
    if(main.petMap[request.method] !== undefined) {
      var plausiblePets = request.url.substr(0, request.url.length-1);
      if(main.petMap[request.method][request.url] !== undefined) {
        main.petMap[request.method][request.url](request, response, data);
      }
      else if(main.petMap[request.method][plausiblePets] !== undefined) {
        main.petMap[request.method][plausiblePets](request, response, data);
      }
      else {
        var splitUrl = request.url.split('/');
        var wildCardUrl = '';
        for(var i = 1; i < (splitUrl.length - 1); i += 1) {
          wildCardUrl += '/' + splitUrl[i];
        };
        wildCardUrl += '/*';
        if(main.petMap[request.method][wildCardUrl] !== undefined) {
          main.petMap[request.method][wildCardUrl](request, response, data);
        }
        else {
          main.respond(response, 410);
        };
      };
    }
    else {
      main.respond(response, 405);
    };
  };
  // The route map for all of our pet and pet categories linked up with the above functions
  this.petMap = {
    "GET": {
      "/": this.top
      , "/cats": this.petsShow
      , "/dogs": this.petsShow
      , "/cats/*": this.petShow
      , "/dogs/*": this.petShow
    }
    , "POST": {
      "/cats": this.petAdd
      , "/dogs": this.petAdd
    }
    , "PUT": {
      "/cats/*": this.petChange
      , "/dogs/*": this.petChange
    }
  };
};

// Creates the petshop server and listens on PORT and IP
var petShop = http.createServer(handlePets);
petShop.listen(PORT, IP, function(){
  console.log('Pet shop is running at http://' + IP + ':' + PORT);
});