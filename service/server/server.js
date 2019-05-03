require('newrelic');
const redis = require('redis');
const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.js');
const pass = require('./pass.js');

const client = redis.createClient(6379, '54.183.148.109');
client.auth(pass);

const loaderioFile = path.join(__dirname, "./loaderio-c83d214aa1c61fe729ae6c57a389daed.txt");

client.on('connect', function () {
  console.log('Redis client connected');
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      if (req.url === "/") {
        fs.readFile(path.join(__dirname, "../public/index.html"), (error, content) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, "binary");
        });
      } else if (req.url.match(/(\/restaurants\/[0-9]*\/reviews)/)) {
        const restaurantid = req.url.split('/')[2];
        client.get(restaurantid, (error, result) => {
          if (!error && result !== null) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(result);
            res.end();
          } else {
            db.getReviews(restaurantid, (err, data) => {
              if (err) {
                console.log(err);
                res.writeHead(500);
              } else {
                client.set(restaurantid, JSON.stringify(data.rows));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(data.rows));
              }
              res.end();
            });
          }
        });
      } else if (req.url.match(/(\/restaurants\/[0-9]*\/reviewsummary)/)) {
        const restaurantid = req.url.split('/')[2];
        db.getBasicInfo(restaurantid, (err, data) => {
          if (err) {
            res.writeHead(500);
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
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
      if (req.url.match(/(\/reviews\/[0-9]*)/)) {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
          db.addReview(body, (err) => {
            if (!err) {
              res.writeHead(200);
              res.end();
            } else {
              res.writeHead(500);
              res.end();
            }
          });
        });
      }
      break;
    case 'PATCH':
      if (req.url.match(/(\/reviews\/[0-9]*\/report)/)) {
        const reviewid = req.url.split('/')[2];
        db.report(reviewid, (err) => {
          if (err) { res.writeHead(500); }
          else {
            res.writeHead(204);
          }
          res.end();
        });
      } else if (req.url.match(/(\/reviews\/[0-9]*\/markhelpful)/)) {
        const reviewid = req.url.split('/')[2];
        db.markHelpful(reviewid, (err) => {
          if (err) { res.writeHead(500); }
          else {
            res.writeHead(204);
          }
          res.end();
        });
      } else if (req.url.match(/(\/reviews\/[0-9]*\/edit)/)) {
        const reviewid = req.url.split('/')[2];
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
          db.editReview(reviewid, body, (err) => {
            if (!err) {
              res.writeHead(200);
              res.end();
            } else {
              res.writeHead(500);
              res.end();
            }
          });
        });
      }
      break;
    case 'DELETE':
      if (req.url.match(/(\/reviews\/[0-9]*\/user\/[0-9]*)/)) {
        const reviewid = req.url.split('/')[2];
        const userid = req.url.split('/')[4];
        db.deleteReview(reviewid, userid, (err) => {
          if (err) { res.writeHead(500); }
          else {
            res.writeHead(204);
          }
          res.end();
        });
      }
      break;
    default:
      res.end();
  }
});

server.listen(80);

