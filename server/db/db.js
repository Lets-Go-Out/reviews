const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'droptable'
});

module.exports.getBasicInfo = (restaurantId, cb) => {
  const queryStr = 'SELECT * FROM restaurants where id = ?';
  connection.query(queryStr, [restaurantId], cb);
};

module.exports.getReviews = (restaurantId, cb) => {
  const queryStr = 'SELECT reviews.*, users.name FROM reviews INNER JOIN users ON reviews.restaurant = ? AND reviews.user = users.id';
  connection.query(queryStr, [restaurantId], cb);
};

module.exports.closeConnection = (cb) => connection.end(cb);