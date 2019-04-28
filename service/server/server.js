require('newrelic');
const loadtest = require('loadtest');
const express = require('express');
const cors = require('cors');
const compression = require('compression');

const db = require('./db/db.js');

const app = express();

app.use(cors());
app.use(compression());


app.use('/restaurants/:restaurantid', express.static('./public'));

app.use(express.static('./public'));

app.get('/restaurants/:restaurantid/reviewsummary', (req, res) => {
  db.getBasicInfo(req.params.restaurantid, (err, data) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    return res.status(200).json(data.rows[0]);
  });
});

app.get('/restaurants/:restaurantid/reviews', (req, res) => {
  db.getReviews(req.params.restaurantid, (err, data) => {
    if (err) { return res.sendStatus(500); }
    return res.status(200).json(data.rows);
  });
});

app.patch('/reviews/:reviewid/report', (req, res) => {
  db.report(req.params.reviewid, (err) => {
    if (err) { return res.sendStatus(500); }
    return res.sendStatus(204);
  });
});

app.patch('/reviews/:reviewid/markhelpful', (req, res) => {
  db.markHelpful(req.params.reviewid, (err) => {
    if (err) { return res.sendStatus(500); }
    return res.sendStatus(204);
  });
});

// app.get('/loaderio-43623c2f75cbaa14f8f99e1533745370/', (req, res) => {
//   res.sendFile('./loaderio-43623c2f75cbaa14f8f99e1533745370.txt');
// })

app.listen(3005);
