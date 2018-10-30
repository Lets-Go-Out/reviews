const express = require('express');
const db = require('./db.js');

const app = require('express');

app.get('/restaurants/:restaurantid/reviewsummary', (req, res) => {
  db.getBasicInfo(req.params.restaurantid, (err, data) => {
    if (err) { return res.sendStatus(500); }
    res.status(200).json(data[0]);
  });
});

app.get('/restaurants/:restaurantid/reviews', (req, res) => {
  db.getReviews(req.params.restaurantId, (err, data) => {
    if (err) { return res.sendStatus(500); }
    res.status(200).json(data);
  });
});

app.listen(3000);
