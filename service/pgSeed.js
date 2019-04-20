const { Pool } = require("pg");
const pass = require("./pass.js");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: pass,
  port: 5433
});

pool.query(
  'copy public.reviews (id, "userId", "restaurantId", "overallRating", "foodRating", "serviceRating", "ambienceRating", "valueRating", wyr, text, date, "partySize", "timesReported", "timesMarkedHelpful") FROM \'C:/Windows/Temp/PostgreSQL/fakeReviews2.csv\' DELIMITER \',\' CSV HEADER QUOTE \'"\' ESCAPE \'\'\'\';',
  (err, res) => {
    console.log(err, res);
    // pool.end();
  }
);

// pool.query(
//   'copy public.restaurants (id, name, "overallRating", "foodRating", "serviceRating", "ambienceRating", "valueRating", wyr, "numReviews") FROM \'C:/Windows/Temp/PostgreSQL/fakeRestaurants2.csv\' DELIMITER \',\' CSV HEADER QUOTE \'"\' ESCAPE \'\'\'\';',
//   (err, res) => {
//     console.log(err, res);
//     pool.end();
//   }
// );

// pool.query(
//   "copy public.users (id, name, \"numReviews\", location) FROM 'C:/Windows/Temp/PostgreSQL/fakeUsers.csv' DELIMITER ',' CSV HEADER QUOTE '\"' ESCAPE '''';",
//   (err, res) => {
//     console.log(err, res);
//     pool.end();
//   }
// );
