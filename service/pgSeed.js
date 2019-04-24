const { Pool } = require("pg");
const pass = require("./pass.js");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: pass,
  port: 5433
});

pool.query('create table if not exists restaurants (id integer Primary Key, name varchar(200), "overallRating" double precision, "foodRating" double precision, "serviceRating" double precision, "ambienceRating" double precision, "valueRating" double precision, wyr double precision, "numReviews" integer)', (err, res) => {
  console.log(err, res);
  // pool.end();
});

pool.query('create table if not exists reviews (id integer Primary Key, "userId" integer, "restaurantId" integer, "overallRating" integer, "foodRating" integer, "serviceRating" integer, "ambienceRating" integer, "valueRating" integer, wyr integer, text text, date varchar(50), "partySize" integer, "timesReported" integer, "timesMarkedHelpful" integer)', (err, res) => {
  console.log(err, res);
  // pool.end();
});

pool.query('create table if not exists users (id integer Primary Key, name varchar(50), "numReviews" integer, location varchar(50))', (err, res) => {
  console.log(err, res);
  // pool.end();
});

pool.query(
  'copy public.reviews (id, "userId", "restaurantId", "overallRating", "foodRating", "serviceRating", "ambienceRating", "valueRating", wyr, text, date, "partySize", "timesReported", "timesMarkedHelpful") FROM \'C:/Windows/Temp/PostgreSQL/fakeReviews2.csv\' DELIMITER \',\' CSV HEADER QUOTE \'"\' ESCAPE \'\'\'\';',
  (err, res) => {
    console.log(err, res);
    // pool.end();
  }
);

pool.query(
  'copy restaurants (id, name, "overallRating", "foodRating", "serviceRating", "ambienceRating", "valueRating", wyr, "numReviews") FROM \'C:/Windows/Temp/PostgreSQL/fakeRestaurants2.csv\' DELIMITER \',\' CSV HEADER QUOTE \'"\' ESCAPE \'\'\'\';',
  (err, res) => {
    console.log(err, res);
    // pool.end();
  }
);

pool.query(
  "copy users (id, name, \"numReviews\", location) FROM 'C:/Windows/Temp/PostgreSQL/fakeUsers.csv' DELIMITER ',' CSV HEADER QUOTE '\"' ESCAPE '''';",
  (err, res) => {
    console.log(err, res);
    pool.end();
  }
);
