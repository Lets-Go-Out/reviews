require('newrelic');
const redis = require('redis');
const http = require('http');
const fs = require('fs');
// const express = require('express');
// const cors = require('cors');
// const compression = require('compression');
const path = require('path');
const db = require('./db/db.js');

// const app = express();
const client = redis.createClient(6379, '54.219.186.113');

const loaderioFile = path.join(__dirname, "./loaderio-6511ed504151f4c060f3e11bdb06157e.txt");

client.on('connect', function () {
  console.log('Redis client connected');
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      if (req.url.match(/(\/reviews\/[1-9]*\/restaurants))/)) {
        client.get(req.params.restaurantid, (error, result) => {
          if (!error && result !== null) {
            return res.status(200).json(result).end();
          } else {
            db.getReviews(req.params.restaurantid, (err, data) => {
              if (err) {
                console.log(err);
                return res.status(500).end();
              }
              client.set(req.params.restaurantid, JSON.stringify(data.rows));
              return res.status(200).json(data.rows).end();
            });
          }
        });
      } else if (req.url.match(/(\/reviews\/[1-9]*\/reviewsummary))/)) {
        db.getBasicInfo(req.params.restaurantid, (err, data) => {
          if (err) {
            //console.log(err);
            return res.status(500).end();
          }
          return res.status(200).json(data.rows[0]).end();
        });
      } else if (req.url === '/loaderio-6511ed504151f4c060f3e11bdb06157e') {
        res.writeHead(200, {
          "Content-Type": "text/plain",
          "Content-Disposition": "attachment; filename=loaderio-6511ed504151f4c060f3e11bdb06157e.txt"
        });
        fs.createReadStream(loaderioFile).pipe(response);
      } else {
        res.status(404).end();
      }
      break;
    case 'POST':
      break;
    case 'PATCH':
      if (req.url.match(/(\/reviews\/[1-9]*\/report))/)) {
        db.report(req.params.reviewid, (err) => {
          if (err) { return res.status(500).end(); }
          return res.status(204).end();
        });
      } else if (req.url.match(/(\/reviews\/[1-9]*\/markhelpful))/)) {
        db.markHelpful(req.params.reviewid, (err) => {
          if (err) { return res.status(500).end(); }
          return res.sendStatus(204).end();
        });
      }
      break;
    case 'DELETE':
      break;
    default:
  }
  res.end();
});

server.listen(80);

// app.use(cors());
// app.use(compression());


// app.use('/restaurants/:restaurantid', express.static('./public'));

// app.use(express.static('./public'));



// app.get('/restaurants/:restaurantid/reviewsummary', (req, res) => {
//   db.getBasicInfo(req.params.restaurantid, (err, data) => {
//     if (err) {
//       //console.log(err);
//       return res.sendStatus(500);
//     }
//     return res.status(200).json(data.rows[0]);
//   });
// });

// app.get('/restaurants/:restaurantid/reviews', (req, res) => {
//   client.get(req.params.restaurantid, (error, result) => {
//     if (!error && result !== null) {
//       return res.status(200).json(result);
//     } else {
//       db.getReviews(req.params.restaurantid, (err, data) => {
//         if (err) {
//           console.log(err);
//           return res.sendStatus(500);
//         }
//         client.set(req.params.restaurantid, JSON.stringify(data.rows));
//         return res.status(200).json(data.rows);
//       });
//     }
//   });
// });

// app.patch('/reviews/:reviewid/report', (req, res) => {
//   db.report(req.params.reviewid, (err) => {
//     if (err) { return res.sendStatus(500); }
//     return res.sendStatus(204);
//   });
// });

// app.patch('/reviews/:reviewid/markhelpful', (req, res) => {
//   db.markHelpful(req.params.reviewid, (err) => {
//     if (err) { return res.sendStatus(500); }
//     return res.sendStatus(204);
//   });
// });

// app.get('/loaderio-6511ed504151f4c060f3e11bdb06157e', (req, res) => {
//   res.sendFile(path.join(__dirname, './loaderio-6511ed504151f4c060f3e11bdb06157e.txt'));
// })

// app.listen(80);
