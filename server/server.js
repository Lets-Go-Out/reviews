const express = require('express');
const db = require('./db/db.js');

const app = express();

app.use(express.static('./public'));

app.get('/restaurants/:restaurantid/reviewsummary', (req, res) => {
  db.getBasicInfo(req.params.restaurantid, (err, data) => {
    if (err) { return res.sendStatus(500); }
    return res.status(200).json(data[0]);
  });
});

app.get('/restaurants/:restaurantid/reviews', (req, res) => {
  db.getReviews(req.params.restaurantid, (err, data) => {
    if (err) { return res.sendStatus(500); }
    return res.status(200).json(data);
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


app.listen(3005);
