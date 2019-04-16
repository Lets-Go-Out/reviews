This is a clone of the front end of OpenTable's reviews service, in React, Node.js and MySQL.

To start:
from the 'service' directory `npm i`

then `docker-compose up` from the root directory

navigate to localhost:3005 to see mock reviews for one restaurant

the db has mock data for 100 restaurants; reviews are viewable by going to localhost:3005/restaurants/<n between 1 and 100>/

// CRUD API

POST /reviews

- Post a review to a restaurant. Adds review to review table, adds user or updates user in user table and updates restaurants table.

GET /resaurants/:restaurantid/reviewsummary

- Gets a summary of a restaurants reviews. (Avg ratings)

GET /restaurants/:restaurantid/reviews

- Gets all of the reviews for a given restaurant.

PATCH /reviews/:reviewid/report

- Updates number of times a review has been reported in review table.

PATCH /reviews/:reviewid/markhelpful

- Updates number of times a review was marked helpful in review table.

PATCH /reviews/:reviewid

- Edit a review, updates reviews table.

DELETE /reviews/:reviewid

- Deletes a review from the reviews table, updates restaurants table and users table.
