const mysql = require('mysql');
// const configVars = require('../../config.js');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'reviewsdb',
  port: '3306',
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: 'droptable',
});


module.exports.getBasicInfo = (restaurantId, cb) => {
  const queryStr = 'SELECT * FROM restaurants where id = ?';
  pool.query(queryStr, [restaurantId], cb);
};

module.exports.getReviews = (restaurantId, cb) => {
  const queryStr = 'SELECT reviews.*, users.name, users.numReviews AS userNumReviews, users.location AS userLocation FROM reviews INNER JOIN users ON reviews.restaurant = ? AND reviews.user = users.id';
  pool.query(queryStr, [restaurantId], cb);
};


module.exports.markHelpful = (reviewId, cb) => {
  const queryStr = 'UPDATE reviews SET timesMarkedHelpful = timesMarkedHelpful + 1 WHERE id = ?';
  pool.query(queryStr, [reviewId], cb);
};

module.exports.report = (reviewId, cb) => {
  const queryStr = 'UPDATE reviews SET timesReported = timesReported + 1 WHERE id = ?';
  pool.query(queryStr, [reviewId], cb);
};

