const { Pool } = require("pg");
const pass = require("./pass.js");
const fs = require('fs');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: pass,
  port: 5433
});


// Example usage
// node pgSeed createRestaurants
// node pgSeed copyRestaurants
// node pgSeed queryMultiple 231240 232240


let args = process.argv.slice(2);

const queryOptions = {
  createRestaurants: pool.query('create table if not exists restaurants (id integer Primary Key, name varchar(200), "overallRating" double precision, "foodRating" double precision, "serviceRating" double precision, "ambienceRating" double precision, "valueRating" double precision, wyr double precision, "numReviews" integer, "reviewIds" integer ARRAY);', (err, res) => {
    console.log(err, res);
  }),
  createReviews: pool.query('create table if not exists reviews (id integer, "userId" integer, "restaurantId" integer, "overallRating" integer, "foodRating" integer, "serviceRating" integer, "ambienceRating" integer, "valueRating" integer, wyr integer, text text, date varchar(50), "partySize" integer, "timesReported" integer, "timesMarkedHelpful" integer, PRIMARY KEY(id, "restaurantId"))', (err, res) => {
    console.log(err, res);
  }),
  createUsers: pool.query('create table if not exists users (id integer Primary Key, name varchar(50), "numReviews" integer, location varchar(50))', (err, res) => {
    console.log(err, res);
  }),
  copyRestaurants: pool.query(
    'copy restaurants (id, name, "overallRating", "foodRating", "serviceRating", "ambienceRating", "valueRating", wyr, "numReviews", "reviewIds") FROM \'C:/Windows/Temp/PostgreSQL/restaurants.csv\' DELIMITER \',\' CSV HEADER QUOTE \'"\' ESCAPE \'\'\'\';',
    (err, res) => {
      console.log(err, res);
    }
  ),
  copyReviews: pool.query(
    'copy reviews (id, "userId", "restaurantId", "overallRating", "foodRating", "serviceRating", "ambienceRating", "valueRating", wyr, text, date, "partySize", "timesReported", "timesMarkedHelpful") FROM \'C:/Windows/Temp/PostgreSQL/reviews.csv\' DELIMITER \',\' CSV HEADER QUOTE \'"\' ESCAPE \'\'\'\';',
    (err, res) => {
      console.log(err, res);
    }
  ),
  copyUsers: pool.query(
    "copy users (id, name, \"numReviews\", location) FROM 'C:/Windows/Temp/PostgreSQL/users.csv' DELIMITER ',' CSV HEADER QUOTE '\"' ESCAPE '''';",
    (err, res) => {
      console.log(err, res);
    }
  ),
  queryMultiple: ((start, stop) => {
    let queryStream = fs.createWriteStream("./queryTimes.csv");
    let queryOK = true, row = "", i = start;

    const queries = () => {
      for (i; i <= stop; i++) {
        pool.query('explain analyze select * from users join (select * from reviews, restaurants where reviews.id = any( restaurants."reviewIds"::int[]) and restaurants.id = $1) sub on users.id = sub."userId"; ', [i], (err, res) => {
          if (err) {
            pool.end();
          }
          row = `\n${res.rows[8]['QUERY PLAN'].split(' ')[2]}, ${res.rows[9]['QUERY PLAN'].split(' ')[2]}, ${+res.rows[8]['QUERY PLAN'].split(' ')[2] + +res.rows[9]['QUERY PLAN'].split(' ')[2]}`
          queryOK = queryStream.write(row);
        })
      }
      if (!queryOK) queryStream.once('drain', queries);
    }
  })(args[1], args[2])
}

queryOptions[args[0]];