require('newrelic');
const redis = require('redis');
const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.js');
const pass = require('./pass.js');

//const client = redis.createClient(6379, '54.183.148.109');
//client.auth(pass);

const localClient = redis.createClient(6379, '127.0.0.1');

const loaderioFile = path.join(__dirname, "./loaderio-c83d214aa1c61fe729ae6c57a389daed.txt");

//client.on('connect', function () {
//  console.log('Redis client connected');
//});

localClient.on('connect', function () {
  console.log('Local redis connected');
});

//client.on('error', function (err) {
//  console.log('Something went wrong ' + err);
//});

localClient.on('error', function (err) {
  console.log('Something went wrong with local redis ' + err);
});

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      if (req.url === "/") {
        fs.readFile(path.join(__dirname, "../public/index.html") ,(error, content) => {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(content, "binary");
	});
      } else if (req.url.match(/(\/restaurants\/[0-9]*\/reviews)/)) {
	const restaurantid = req.url.split('/')[2];
	localClient.get(restaurantid, (error, result) => {
		if(!error && result !== null) {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(result);
			res.end();
		} else {
        //client.get(restaurantid, (error, result) => {
        //  if (!error && result !== null) {
        //    res.writeHead(200, { 'Content-Type': 'application/json' });
	//    res.write(result);
	//    res.end();
        //  } else {
            db.getReviews(restaurantid, (err, data) => {
              if (err) {
                console.log(err);
                res.writeHead(500);
              } else {
		localClient.set(restaurantid, JSON.stringify(data.rows));
                client.set(restaurantid, JSON.stringify(data.rows));
                res.writeHead(200,  { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(data.rows));
              }
	      res.end();
            });
          }
        });
	//}});
      } else if (req.url.match(/(\/restaurants\/[0-9]*\/reviewsummary)/)) {
	const restaurantid = req.url.split('/')[2];
        db.getBasicInfo(req.params.restaurantid, (err, data) => {
          if (err) {
            res.writeHead(500);
          } else {
            res.writeHead(200,  { 'Content-Type': 'application/json' });
            res.write(data.rows[0]);
          }
	  res.end();
        });
      } else if (req.url === '/loaderio-c83d214aa1c61fe729ae6c57a389daed/') {
        res.writeHead(200, {
          "Content-Type": "text/plain",
          "Content-Disposition": "attachment; filename=loaderio-c83d214aa1c61fe729ae6c57a389daedloaderio-c83d214aa1c61fe729ae6c57a389daed.txt"
        });
        fs.readFile(loaderioFile, (error, content) => {
		res.end(content);
	});
      } else {
        res.writeHead(404);
	res.end();
      }
      break;
    case 'POST':
      break;
    case 'PATCH':
      if (req.url.match(/(\/reviews\/[0-9]*\/report)/)) {
        db.report(req.params.reviewid, (err) => {
          if (err) { res.writeHead(500); }
          else {
            res.writeHead(204);
          }
	  res.end();
        });
      } else if (req.url.match(/(\/reviews\/[0-9]*\/markhelpful)/)) {
        db.markHelpful(req.params.reviewid, (err) => {
          if (err) { res.writeHead(500); }
          else {
            res.writeHead(204);
          }
	  res.end();
        });
      }
      break;
    case 'DELETE':
      break;
    default:
	res.end();
  }
});

server.listen(80);

