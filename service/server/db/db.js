const { Pool } = require("pg");
const pass = require("../../pass");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: pass,
  port: 5433
});

module.exports.addReview = (reviewInfo, cb) => {
  const { userId, restaurantId, overall, food, service, ambience, value, wyr, text, date, partySize, timesReported, timesHelpful } = reviewInfo;
  const queryStr =
    'INSERT INTO reviews ("userId", "restaurantId", "overallRating", "foodRating", "serviceRating", "ambienceRating", "valueRating", "wyr", "text", "date", "partySize", "timesReported", "timesMarkedHelpful") '
    + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);';
  pool.query(queryStr, [userId, restaurantId, overall, food, service, ambience, value, wyr, text, date, partySize, timesReported, timesHelpful], cb);
}

module.exports.getBasicInfo = (restaurantId, cb) => {
  const queryStr = 'SELECT * FROM restaurants where "restaurantId" = $1';
  pool.query(queryStr, [restaurantId], cb);
};

module.exports.getReviews = (restaurantId, cb) => {
  const queryStr =
    'select * from users join (select * from reviews, restaurants where reviews."reviewId" = any( restaurants."reviewIds"::int[]) and restaurants."restaurantId" = $1) sub on users.id = sub."userId";';
  pool.query(queryStr, [restaurantId], cb);
};

module.exports.markHelpful = (reviewId, cb) => {
  const queryStr =
    'UPDATE reviews SET "timesMarkedHelpful" = "timesMarkedHelpful" + 1 WHERE "reviewId" = $1';
  pool.query(queryStr, [reviewId], cb);
};

module.exports.report = (reviewId, cb) => {
  const queryStr =
    'UPDATE reviews SET "timesReported" = "timesReported" + 1 WHERE "reviewId" = $1';
  pool.query(queryStr, [reviewId], cb);
};

module.exports.editReview = (reviewId, text, cb) => {
  const queryStr =
    'UPDATE reviews SET "text" = $1 WHERE "reviewId" = $2';
  pool.query(queryStr, [text, reviewId], cb);
}

module.exports.deleteReview = (reviewId, userId, cb) => {
  const deleteQueryStr =
    'DELETE from reviews WHERE "reviewId" = $1';
  const updateQueryStr =
    'UPDATE users SET "userNumReviews" = "userNumReviews" + WHERE id = $1';
  pool.query(deleteQueryStr, [reviewId], (err, result) => {
    if (err) {
      cb(err, result);
    }
    pool.query(updateQueryStr, [userId], cb);
  });
}