const mysql = require('mysql');
const configVars = require('../../config.js');

const connection = mysql.createConnection({
  host: 'reviewsdb',
  port: '3306',
  user: 'root',
  password: 'abc123',
  database: 'droptable',
});

module.exports.getBasicInfo = (restaurantId, cb) => {
  const queryStr = 'SELECT * FROM restaurants where id = ?';
  connection.query(queryStr, [restaurantId], cb);
};

module.exports.getReviews = (restaurantId, cb) => {
  const queryStr = 'SELECT reviews.*, users.name, users.numReviews AS userNumReviews, users.location AS userLocation FROM reviews INNER JOIN users ON reviews.restaurant = ? AND reviews.user = users.id';
  connection.query(queryStr, [restaurantId], cb);
};


module.exports.markHelpful = (reviewId, cb) => {
  const queryStr = 'UPDATE reviews SET timesMarkedHelpful = timesMarkedHelpful + 1 WHERE id = ?';
  connection.query(queryStr, [reviewId], cb);
};

module.exports.report = (reviewId, cb) => {
  const queryStr = 'UPDATE reviews SET timesReported = timesReported + 1 WHERE id = ?';
  connection.query(queryStr, [reviewId], cb);
};


module.exports.closeConnection = cb => connection.end(cb);
