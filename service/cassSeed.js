const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['54.183.212.64', '13.56.194.185'], localDataCenter: "us-west", keyspace: 'reviews' });

client.connect((err, result) => {
    console.log(err, result);
});

let args = process.argv.slice(2);
const createUsersQuery = 'CREATE TABLE IF NOT EXISTS reviews.users ( id int PRIMARY KEY, name text, numReviews int, location text);';
const createReviewTypeQuery = 'CREATE TYPE reviews.review ( reviewId int, userId int, overallrating int, foodrating int, servicerating int, ambiencerating int, valuerating int, wyr int, date timestamp, partysize int, text text, timesreported int, timesmarkedhelpful int);';
const createRestaurantsQuery = 'CREATE TABLE IF NOT EXISTS reviews.restaurants (id int PRIMARY KEY, name text, overallrating decimal, foodrating decimal, servicerating decimal, ambiencerating decimal, valuerating decimal, wyr decimal, numreviews int, reviews list<frozen<review>>);';
const queries = [{ query: createUsersQuery }, { query: createReviewTypeQuery }, { query: createRestaurantsQuery }];

const queryOptions = {
    createKeyspace: client.execute('create keyspace reviews with replication = {\'class\': \'NetworkTopologyStrategy\', \'us-west\': 3};').then(result => console.log(result)),
    createUsers: client.execute(createUsersQuery).then(result => console.log(result)),
    createRestaurants: client.execute(createRestaurantsQuery).then(result => console.log(result)),
    createReviewtype: client.execute(createReviewTypeQuery).then(result => console.log(result)),
    createAll: client.batch(queries).then(result => console.log(result)),
    copyQueryUsers: client.execute("COPY  '/mnt/c/Users/lsant/Documents/Programming/JavaScript/SEI/reviews/service/fakeNoSQLUsers.csv' WITH HEADER = TRUE AND DELIMITER = '#' AND QUOTE = '''';")
        .then(result => console.log(result)),
    copyQueryRestaurants: client.execute("COPY reviews.restaurants (id, name, overallrating, foodrating, servicerating, ambiencerating, valuerating, wyr, numreviews, reviews) FROM '/mnt/c/Users/lsant/Documents/Programming/JavaScript/SEI/reviews/service/fakeNoSQLRestaurants.csv' WITH HEADER = TRUE AND DELIMITER = '#' AND QUOTE = '''';")
        .then(result => console.log(result)),
    completeSelectQuery: ((restId) => {
        const selectRestQuery = "select * from  reviews.restaurants where id = ?"
        const selectUserQuery = "select * from reviews.users where id = ?"
        client.execute(selectRestQuery, [restId], { prepare: true, traceQuery: true })
            .then(result => {
                let reviews = JSON.parse(result.rows[0].reviews);
                reviews.forEach(review => {
                    client.execute(selectUserQuery, [review.userid], { prepare: true, traceQuery: true })
                        .then(result => console.log(result))
                        .catch(err => console.log(err));
                });
            });
    })(args[1])
}

queryOptions[args[0]];
