const http			= require('http'),
      fs			= require('fs'),
      path			= require('path'),
      contentTypes	= require('./utils/content-types'),
      sysInfo		= require('./utils/sys-info'),
      env			= process.env,
	  MongoClient	= require('mongodb').MongoClient,
	  assert		= require('assert'),
	  
	  bodyParser = require('body-parser'),
	  express = require('express'),
	  app = express(),
	  cors = require('cors'),
	  
	  fireadmin		= require("firebase-admin");

var mongodb_connection_string = 'mongodb://iotadmin:hg84sd5H@ds052819.mlab.com:52819/homeiot';
var serviceAccount = require("./easyhome-9cd10-firebase-adminsdk-tfagh-a78c9d3883.json");

fireadmin.initializeApp({
  credential: fireadmin.credential.cert(serviceAccount),
  databaseURL: "https://easyhome-9cd10.firebaseio.com"
});



app.use(bodyParser.urlencoded({
	extended: true
}));


app.use(cors());

/*
app.use(function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

});
*/

/*
//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

//...
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'cool beans' }));
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});
*/



app.listen(3001, function() {
	console.log(`Application worker ${process.pid} started...`);
});

app.get('/', function(req, res) {

	let url = req.url;
	if (url == '/') {
		url += 'index.html';
	}

	if (url == '/health') {
		res.writeHead(200);
		res.end();
	} else if (url == '/info/gen' || url == '/info/poll') {
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Cache-Control', 'no-cache, no-store');
		res.end(JSON.stringify(sysInfo[url.slice(6)]()));
	} else {
		fs.readFile('./static' + url, function(err, data) {
			if (err) {
				res.writeHead(404);
				res.end('Not found');
			} else {
				let ext = path.extname(url).slice(1);
				res.setHeader('Content-Type', contentTypes[ext]);
				if (ext === 'html') {
					res.setHeader('Cache-Control', 'no-cache, no-store');
				}
				res.end(data);
			}
		});
	}

});

app.post('/quotes', (req, res) => {

	var ObjectId = require('mongodb').ObjectID;
	//_id: ObjectId("5099803df3f4948bd2f98491"),
	var mydoc1 = {
		_id: ObjectId("5099803df3f4948bd2f98392"),
		name: "abcd",
		birth: new Date('Jun 23, 1912'),
		death: new Date('Jun 07, 1954'),
		contribs: ["Turing machine", "Turing test", "Turingery"]
	}

	var mydoc2 = {
		name: "xyz",
		birth: new Date('Jun 23, 1912'),
		death: new Date('Jun 07, 1954'),
		contribs: ["Turing machine", "Turing test", "Turingery"]
	}
	
	var mydoc3 = {
		name: "qwer",
		birth: new Date('Jun 23, 1912'),
		death: new Date('Jun 07, 1954'),
		contribs: ["Turing machine", "Turing test", "Turingery"]
	}

	var mydoc4 = {
		_id: ObjectId("5099803df3f4948bd2f98394"),
		name: "poiyu",
		birth: new Date('Jun 23, 1912'),
		death: new Date('Jun 07, 1954'),
		contribs: ["Turing machine", "Turing test", "Turingery"]
	}
	
	//var mydoc = [mydoc1, mydoc2, mydoc3, mydoc4];
	
	//var mydoc = [mydoc1, mydoc4];
	
	var mydoc = {
	"SensorID": "HARDCODEDID01",
	"SensorType": "TYPECODE01",
	"RelatedCentralHub": "CENTRALHUB_ID01",
	"SensorLogData": [
		{
			"RecordedTime": "20161209143459",
			"DataField1": "Data",
			"DataField2": "Data",
			"DataField3": "Data"
		}, {
			"RecordedTime": "20161209143500",
			"DataField1": "Data",
			"DataField2": "Data",
			"DataField3": "Data"
		}
	]
}

	
	var myLabMongoDB = new mLabMongoDB(mongodb_connection_string);
	var collectionName = 'testCollection';
//	var collectionName = 'HARDCODEDID01HARDCODEDID01HARDCODEDID01HARDCODEDID01HARDCODEDID01';
	var query = {};
	
//	myLabMongoDB.insertDoc(collectionName, mydoc);
//	myLabMongoDB.pushDoc(collectionName);

	myLabMongoDB.findDoc(collectionName, query, function(results) {
	
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(JSON.stringify(results));
	});

	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end("Test");
});



app.post('/firebase', (req, res) => {
	
	
	console.log("Got one Request");
	var obj = Object.keys(req.body)[0].split("\":\"");
	var userId = obj[1].split("\"");
		userId = userId[0].split("\'");
		userId = userId[0];
	var tokenId = obj[2].split("\"");
		tokenId = tokenId[0].split("\"");
		tokenId = tokenId[0];
		
	//console.log(obj);
	//console.log("------------------------------");
	//console.log(userId);
	//console.log("------------------------------");
	//console.log(tokenId);
	//console.log(obj.toString());
	
	//res.writeHead(200, {'Content-Type': 'text/html'});
	//res.end("Ok");

	/* fireadmin.auth().verifyIdToken(Object.keys(req.body).toString()).then(function(decodedToken) { */
	fireadmin.auth().verifyIdToken(tokenId).then(function(decodedToken) {
		var uid = decodedToken.uid;
		if(uid === userId) {
			
			res.end("Every Thing is Fine");
		} else {
		
			//res.writeHead(200, {'Content-Type': 'text/html'});
			res.end("User ID Mismatch");
		}
		
	}).catch(function(error) {
		console.log(error);
	});
	
	
});



var mLabMongoDB = function(mongodb_connection_string) {

    var self = this;

    self.testFunc = function() {

        var docs;
        MongoClient.connect(mongodb_connection_string, function(err, db) {
            assert.equal(null, err);
            docs = db.collection('testCollection').find();
            db.close();
        });

        for (var key in docs) {
            console.log(key);
        }

    }


    self.pushDoc = function(collectionName) {

        MongoClient.connect(mongodb_connection_string, function(err, db) {
            assert.equal(null, err);
            db.collection(collectionName).findAndModify({
                query: {
                    name: "joe"
                },
                update: {
                    $inc: {
                        product_available: -1
                    },
                    $push: {
                        contribs: "dasdas"
                    }
                }
            });

            db.close();
        });

    }

    // below functions are working
    self.findDoc = function(collectionName, query, callback) {

        MongoClient.connect(mongodb_connection_string, function(err, db) {
            assert.equal(null, err);
            db.collection(collectionName).find(query).toArray(function(err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length) {
                    //console.log('Number:', result.length);					
                    return callback(result);
                } else {
                    console.log('No document(s) found with defined "find" criteria!');
                }
                db.close();
            });
        });

    }


    self.insertDoc = function(collectionName, mydoc) {

        MongoClient.connect(mongodb_connection_string, function(err, db) {
            assert.equal(null, err);
            db.collection(collectionName).insert(mydoc, function(err, r) {
                assert.equal(null, err);
            });
            db.close();
        });

    }

}





/*
let server = http.createServer(function(req, res) {

	let url = req.url;
	
    if (req.method == 'POST') {
        console.log("POST");
		console.log(req);
        var body = '';
        
		req.on('data', function(data) {
            body += data;
            console.log("Partial body: " + body);
        });
        req.on('end', function() {
            console.log("Body: " + body + url);
        });
		
		
		
		var myLabMongoDB = new mLabMongoDB(mongodb_connection_string);
		var collectionName = 'testCollection';
		var query = {};
		
		myLabMongoDB.findDoc(collectionName, query, function(results) {
	
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(JSON.stringify(results));
		});
		
		/*
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end('post received' + url);
		*/
		
	/*	
    } else {
		
        if (url == '/') {
            url += 'index.html';
        }

        if (url == '/health') {
            res.writeHead(200);
            res.end();
        } else if (url == '/info/gen' || url == '/info/poll') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache, no-store');
            res.end(JSON.stringify(sysInfo[url.slice(6)]()));
        } else {
            fs.readFile('./static' + url, function(err, data) {
                if (err) {
                    res.writeHead(404);
                    res.end('Not found');
                } else {
                    let ext = path.extname(url).slice(1);
                    res.setHeader('Content-Type', contentTypes[ext]);
                    if (ext === 'html') {
                        res.setHeader('Cache-Control', 'no-cache, no-store');
                    }
                    res.end(data);
                }
            });
        }

    }
});

server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function() {
    console.log(`Application worker ${process.pid} started...`);
});

	*/


