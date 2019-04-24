const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: "datacenter1", keyspace: 'reviews' });

client.connect((err, result) => {

});

const createUsersQuery = 'CREATE TABLE IF NOT EXISTS reviews.users ( id int PRIMARY KEY, name text, numReviews int, location text);';
const createReviewTypeQuery = 'CREATE TYPE reviews.review ( reviewId int, userId int, overallrating int, foodrating int, servicerating int, ambiencerating int, valuerating int, wyr int, date timestamp, partysize int, text text, timesreported int, timesmarkedhelpful int);'
const createRestaurantsQuery = 'CREATE TABLE IF NOT EXISTS reviews.restaurants (id int PRIMARY KEY, name text, overallrating decimal, foodrating decimal, servicerating decimal, ambiencerating decimal, valuerating decimal, wyr decimal, numreviews int, reviews list<frozen<review>>)'
const queries = [{ query: createUsersQuery }, { query: createReviewTypeQuery }, { query: createRestaurantsQuery }];

client.bacth(queries)
    .then(result => console.log(result));

const copyQuery = "COPY reviews.users (id, name, numreviews, location) FROM '/mnt/c/Users/lsant/Documents/Programming/JavaScript/SEI/reviews/service/fakeNoSQLUsers.csv' WITH HEADER = TRUE AND DELIMITER = '#' ;"
client.execute(copyQuery)
    .then(result => console.log(result));
