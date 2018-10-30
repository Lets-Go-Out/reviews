const faker = require('faker');
const fs = require('fs');
const moment = require('moment');

faker.seed(105);

const fakeRestaurants = [];

for (let i = 1; i <= 100; i++) {
  const fakeRestaurant = {id: i};
  const fakeWords = [];
  const length = faker.random.number() % 3;

  for (let i = 0; i <= length; i++) {
    fakeWords.push(faker.random.word());
  }

  fakeRestaurant.name = fakeWords.join(' ');

  fakeRestaurants.push(fakeRestaurant);
}

const fakeUsers = [];

for (let i = 1; i <= 100; i++) {
  const fakeUser = {id: i};
  fakeUser.name = faker.name.findName();
  fakeUsers.push(fakeUser);
}


const fakeReviewTextGenerator = () => {
  const reviewText = [];
  const paragraphs = faker.random.number(4);
  for (let p = 0; p <= paragraphs; p++) {
    const sentences = faker.random.number(3) + 2;
    let paragraph = faker.lorem.paragraph(sentences);
    reviewText.push(paragraph);
  }
  return reviewText.join('\n\n');
};

const ratingGenerator = () => {
  //creates a random integer from 1 to 5, weighted to have more 4s and 5s appear
  let randomishNum = faker.random.number(42) + 1;
  const rating = Math.floor(Math.log2(randomishNum) + 1);
  return rating === 6 ? 5 : rating;
};

const fakeReviewGenerator = (restaurantId) => {
  return {
    restaurantId,
    userId: faker.random.number(99) + 1,
    overallRating: ratingGenerator(),
    foodRating: ratingGenerator(),
    serviceRating: ratingGenerator(),
    ambienceRating: ratingGenerator(),
    valueRating: ratingGenerator(),
    wyr: faker.random.number(4) !== 4 ? 1 : 0,
    date: moment(faker.date.recent(400)).format('YYYY-MM-DD HH:MM:SS'),
    partySize: faker.random.number(6) + 2,
    text: fakeReviewTextGenerator(),
  };
};

const fakeReviews = [];

const updateAverage = (newVal, avg, newNumOfThings) => {
  const oldTotal = avg * (newNumOfThings - 1);
  return (oldTotal + newVal) / newNumOfThings;
};

fakeRestaurants.forEach(restaurant => {
  const numReviews = faker.random.number(14) + 3;

  for (let i = 0; i < numReviews; i++) {
    const review = fakeReviewGenerator(restaurant.id);
    const {
      overallRating,
      foodRating,
      serviceRating,
      ambienceRating,
      valueRating,
      wyr
    } = review;
    if (!restaurant.numReviews) {
      Object.assign(restaurant, {
        numReviews: 1,
        overallRating,
        foodRating,
        serviceRating,
        ambienceRating,
        valueRating,
        wyr: wyr ? 100 : 0
      });
    } else {
      restaurant.numReviews += 1;
      restaurant.overallRating = updateAverage(overallRating, restaurant.overallRating, restaurant.numReviews);
      restaurant.foodRating = updateAverage(foodRating, restaurant.foodRating, restaurant.numReviews);
      restaurant.serviceRating = updateAverage(serviceRating, restaurant.serviceRating, restaurant.numReviews);
      restaurant.ambienceRating = updateAverage(ambienceRating, restaurant.ambienceRating, restaurant.numReviews);
      restaurant.valueRating = updateAverage(valueRating, restaurant.valueRating, restaurant.numReviews);
      restaurant.wyr = updateAverage(wyr ? 100 : 0, restaurant.wyr, restaurant.numReviews);
    }
    fakeReviews.push(review);
  }
});

const toCSV = (arrayOfObjects, arrayOfColNames, isIdprovided = true) => {
  const result = [];
  result[0] = arrayOfColNames.slice();
  if (!isIdprovided) {
    result[0].unshift('id');
  }
  result[0] = result[0].join(',');
  arrayOfObjects.forEach((obj, idx) => {
    const row = [];
    if (!isIdprovided) {
      row[0] = idx + 1; 
    }
    arrayOfColNames.forEach((colName) => {
      row.push(`"${obj[colName]}"`);
    });
    result.push(row.join(','));
  });

  return result.join('\n');

};

const restaurantCols = [
  'id',
  'name',
  'overallRating',
  'foodRating',
  'serviceRating',
  'ambienceRating',
  'valueRating',
  'wyr',
  'numReviews'
];

const userCols = [
  'id',
  'name'
];

const reviewCols = [
  'userId',
  'restaurantId',
  'overallRating',
  'foodRating',
  'serviceRating',
  'ambienceRating',
  'valueRating',
  'wyr',
  'text',
  'date',
  'partySize'
];

fs.writeFileSync('./fakeRestaurants.csv', toCSV(fakeRestaurants, restaurantCols));
fs.writeFileSync('./fakeUsers.csv', toCSV(fakeUsers, userCols));
fs.writeFileSync('./fakeReviews.csv', toCSV(fakeReviews, reviewCols, false));

