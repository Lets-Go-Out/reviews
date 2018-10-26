const faker = require('faker');
const fs = require('fs');

faker.seed(105);

const fakeRestaurants = [];

for (let i = 1; i <= 100; i++) {
  const fakeRestaurant = {id: i};
  const fakeWords = [];
  const length = faker.random.number() % 3;

  for (let i = 0; i <= length; i++) {
    fakeWords.push(faker.random.word())
  }

  fakeRestaurant.name = fakeWords.join(' ');

  fakeRestaurants.push(fakeRestaurant);
}

const fakeUsers = [];

for(let i = 1; i <= 100; i++) {
  const fakeUser = {id: i};
  fakeUser.name = faker.name.findName();
  fakeUsers.push(fakeUser);
}


const fakeReviewTextGenerator = () => {
  const reviewText = [];
  const paragraphs = faker.random.number() % 5;
  for (let p = 0; p <= paragraphs; p++) {
    let paragraph = '';
    const sentences = faker.random.number() % 4 + 2;
    for (let s = 0; s <= sentences; s++) {
      paragraph += faker.lorem.sentence();
    }
    reviewText.push(paragraph);
  }

  return reviewText.join('\n\n');
}

const ratingGenerator = () => {
  let randomUpTo16 = faker.random.number() % 20 + 1;
  return Math.round(Math.log2(randomUpTo16) + 1);
}

const fakeReviewGenerator = (restaurantId) => {
  return {
    restaurantId,
    userId: faker.random.number() % 100 + 1,
    overallRating: ratingGenerator(),
    foodRating: ratingGenerator(),
    serviceRating: ratingGenerator(),
    ambienceRating: ratingGenerator(),
    valueRating: ratingGenerator(),
    wyr: faker.random.number() % 4 !== 0,
    date: faker.date.recent(),
    partySize: faker.random.number % 7 + 2,
    text: fakeReviewTextGenerator(),
  }
}

const fakeReviews = [];

fakeRestaurants.forEach(restaurant => {
  const numReviews = faker.random.number() % 14 + 3;
  for (let i = 0; i < numReviews; i++) {
    fakeReviews.push(fakeReviewGenerator(restaurant.id));
  }
});


