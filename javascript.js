var os = require('os');
var sql = require('mysql');
var mongo = require('mongodb').MongoClient;
var connection = sql.createConnection({
  host     : 'localhost',
  user     : 'nn',
  password : 'DOwixe15HE3e',
  database: 'playground'
});
connection.connect();
/*var mysql = {
    "user": "nn"
    , "db": "nn"
    , "pwd": "DOwixe15HE3e"
    , "host": "localhost"
    , "charset": "utf8"
};*/
var startMemory = os.freemem();
var controller = {
    "testCount": 100000
    , "takeTime": function(action) {
        var date = new Date();
        var startTime = date.getTime();
        var endTime = 0;
        this[action]();
        date = new Date();
        endTime = date.getTime();
        console.log(((endTime - startTime) / 1000).toFixed(4) + 's to do ' + action);
        return false;
    }
    , "arrayTest": function() {
        var list = [];
        for(var i = 0; i < this.testCount; i += 1) {
            list[i] = 'test' + i;
        };
        return false;
    }
    , "objectTest": function() {
        var list = {};
        for(var i = 0; i < this.testCount; i += 1) {
            list['test' + i] = 'test' + i;
        };
        return false;
    }
    , "mathTest": function() {
        var numbera = 1;
        var numberb = 1;
        var numberc = 1;
        var numberd = 1;
        for(var i = 1; i <= this.testCount; i += 1) {
            numbera += i;
            numberb -= i;
            numberc = numberc * i;
            numberd = numberc / i;
        };
        return false;
    }
    , "sqlTest": function() {
        var data = {"text": ""}
        this.testCount = 1000;
        this.timerCallback('sqlTest');
        for(var i = 1; i <= this.testCount; i += 1) {
            data.text = 't' + i;
            connection.query('INSERT INTO tester SET ?', data, function(err, rows) {
                //console.log(rows);
                controller.timerCallback('sqlTest');
            });
        };
        return false;
    }
    , "nosqlTest": function() {
        // Connection URL 
        var url = 'mongodb://localhost:27017/test';
        // Use connect method to connect to the Server
        this.testCount = 1000;
        this.timerCallback('nosqlTest');
        mongo.connect(url, function(err, db) {
            controller.mongoPointer = db;
            for(var i = 1; i <= controller.testCount; i += 1) {
                var user = {
                    "derp": "merp"
                    ,"schmerp": i
                };
                var collection = db.collection('userss');
                collection.insert(user, function(err, result) {
                    controller.timerCallback('nosqlTest');
                });
            };
        });
        return false;
    }
    , "callbacker": {}
    , "timerCallback": function(action) {
        if(this.callbacker.hasOwnProperty(action)) {
            this.callbacker[action].count += 1;
            if(this.callbacker[action].count === this.callbacker[action].maxcount) {
                if(this.mongoPointer !== undefined) {
                    this.mongoPointer.close();
                };
                if(action === 'sqlTest') {
                    controller.nosqlTest();
                };
                console.log((((new Date()).getTime() - this.callbacker[action].startTime) / 1000).toFixed(4) + 's to do ' + action);
            };
        }
        else {
            this.callbacker[action] = {
                "startTime": (new Date()).getTime()
                , "maxcount": this.testCount
                , "count": 0
            };
        };
        return false;
    }
};
console.log('#####JS TEST#####');
controller.takeTime('arrayTest');
controller.takeTime('objectTest');
controller.takeTime('mathTest');
controller.sqlTest();
connection.end();
console.log(((startMemory - os.freemem()) / 1024 / 1024).toFixed(2) + 'MB RAM used');
//console.log('CPU load last minute: ' + (os.loadavg()[0]).toFixed(2) + '%');