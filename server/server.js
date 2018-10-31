const express = require('express');
const db = require('./db/db.js');

const app = express();

app.use(express.static('./public'));

app.get('/restaurants/:restaurantid/reviewsummary', (req, res) => {
  db.getBasicInfo(req.params.restaurantid, (err, data) => {
    if (err) { return res.sendStatus(500); }
    res.status(200).json(data[0]);
  });
});

app.get('/restaurants/:restaurantid/reviews', (req, res) => {
  db.getReviews(req.params.restaurantid, (err, data) => {
    if (err) { return res.sendStatus(500); }
    res.status(200).json(data);
  });
});

app.listen(3005);
