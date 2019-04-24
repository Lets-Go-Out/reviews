const faker = require("faker");
const fs = require("fs");

faker.seed(105);

const createFakeRestaurant = i => {
  const fakeRestaurant = { id: i };
  const fakeWords = [];
  const length = faker.random.number() % 3;

  for (let idx = 0; idx <= length; idx += 1) {
    fakeWords.push(faker.random.word());
  }

  fakeRestaurant.name = fakeWords.join(" ");
  return fakeRestaurant;
};

const fakeUserGenerator = i => {
  const fakeUser = { id: i };
  fakeUser.name = faker.name.findName();
  fakeUser.numReviews = faker.random.number(50) + 10;
  fakeUser.location = faker.address.city();
  return fakeUser;
};

const fakeReviewTextGenerator = () => {
  const reviewText = [];
  const paragraphs = faker.random.number(2);
  for (let p = 0; p <= paragraphs; p += 1) {
    const sentences = faker.random.number(2) + 1;
    const paragraph = faker.lorem.paragraph(sentences);
    reviewText.push(paragraph);
  }
  return reviewText.join("\n\n");
};

const ratingGenerator = () => {
  // creates a random integer from 1 to 5, weighted to have more 4s and 5s appear
  const randomishNum = faker.random.number(42) + 1;
  const rating = Math.floor(Math.log2(randomishNum) + 1);
  return rating === 6 ? 5 : rating;
};

const fakeReviewGenerator = restaurantId => ({
  restaurantId,
  userId: faker.random.number(10000000) + 1,
  overallRating: ratingGenerator(),
  foodRating: ratingGenerator(),
  serviceRating: ratingGenerator(),
  ambienceRating: ratingGenerator(),
  valueRating: ratingGenerator(),
  wyr: faker.random.number(4) !== 4 ? 1 : 0,
  date: new Date(faker.date.recent(400)).toISOString(),
  partySize: faker.random.number(6) + 2,
  text: fakeReviewTextGenerator(),
  timesReported: 0,
  timesMarkedHelpful: 0
});

const newAvg = (newVal, avg, newNumOfThings) => {
  const oldTotal = avg * (newNumOfThings - 1);
  return (oldTotal + newVal) / newNumOfThings;
};

const addReviews = (rest, fakeReviews) => {
  const numReviews = faker.random.number(6) + 1;

  for (let idx = 0; idx < numReviews; idx += 1) {
    const review = fakeReviewGenerator(rest.id);
    const {
      overallRating,
      foodRating,
      serviceRating,
      ambienceRating,
      valueRating,
      wyr
    } = review;
    if (!rest.numReviews) {
      Object.assign(rest, {
        numReviews: 1,
        overallRating,
        foodRating,
        serviceRating,
        ambienceRating,
        valueRating,
        wyr: wyr ? 100 : 0
      });
    } else {
      rest.numReviews += 1;
      rest.overallRating = newAvg(
        overallRating,
        rest.overallRating,
        rest.numReviews
      );
      rest.foodRating = newAvg(foodRating, rest.foodRating, rest.numReviews);
      rest.serviceRating = newAvg(
        serviceRating,
        rest.serviceRating,
        rest.numReviews
      );
      rest.ambienceRating = newAvg(
        ambienceRating,
        rest.ambienceRating,
        rest.numReviews
      );
      rest.valueRating = newAvg(valueRating, rest.valueRating, rest.numReviews);
      rest.wyr = newAvg(wyr ? 100 : 0, rest.wyr, rest.numReviews);
    }
    fakeReviews.push(review);
  }
};

const toCSV = (obj, arrayOfColNames) => {
  const row = [];
  arrayOfColNames.forEach((colName, i) => {
    if (i === 0) {
      row.push(`\n"${obj[colName]}"`);
    } else {
      row.push(`"${obj[colName]}"`);
    }
  });
  return row.join(",");
};

const reviewsToCSV = (arrayOfObjects, arrayOfColNames) => {
  const result = [];
  arrayOfObjects.forEach((obj, i) => {
    const row = [];
    row[0] = "\n" + ++reviewCount;
    arrayOfColNames.forEach((colName, j) => {
      if (i === 0 && j === 0) {
        row.push(`"${obj[colName]}"`);
      } else {
        row.push(`"${obj[colName]}"`);
      }
    });
    result.push(row.join(","));
  });
  return result.join("");
};

const restaurantCols = [
  "id",
  "name",
  "overallRating",
  "foodRating",
  "serviceRating",
  "ambienceRating",
  "valueRating",
  "wyr",
  "numReviews"
];

const userCols = ["id", "name", "numReviews", "location"];

const reviewCols = [
  "userId",
  "restaurantId",
  "overallRating",
  "foodRating",
  "serviceRating",
  "ambienceRating",
  "valueRating",
  "wyr",
  "text",
  "date",
  "partySize",
  "timesReported",
  "timesMarkedHelpful"
];

let restStream = fs.createWriteStream("C:/Windows/Temp/PostgreSQL/fakeRestaurants2.csv");
let reviewStream = fs.createWriteStream("C:/Windows/Temp/PostgreSQL/fakeReviews2.csv");
let userStream = fs.createWriteStream("C:/Windows/Temp/PostgreSQL/fakeUsers.csv");

const LIMIT = 10000000;
let i = 1;
let reviewCount = 0;
restStream.write(restaurantCols.slice().join(","));
let appendedRevCols = reviewCols.slice();
appendedRevCols.unshift("id");
reviewStream.write(appendedRevCols.join(","));
userStream.write(userCols.slice().join(","));

function writing(callback) {
  let restOK = true,
    userOK = true,
    reviewOK = true;
  do {
    let fakeReviews = [];
    let rest = createFakeRestaurant(i);
    addReviews(rest, fakeReviews);
    let user = fakeUserGenerator(i);
    i++;
    console.log(i);
    if (i % 10000 === 0) {
      console.clear();
    }
    if (i === LIMIT) {
      restStream.write(toCSV(rest, restaurantCols), "utf8", callback);
      userStream.write(toCSV(user, userCols), "utf8", callback);
      reviewStream.write(
        reviewsToCSV(fakeReviews, reviewCols),
        "utf8",
        callback
      );
    } else {
      restOK = restStream.write(toCSV(rest, restaurantCols));
      userOK = userStream.write(toCSV(user, userCols));
      reviewOK = reviewStream.write(reviewsToCSV(fakeReviews, reviewCols));
    }
  } while (i <= LIMIT && restOK && reviewOK && userOK);
  if (i < LIMIT) {
    if (!reviewOK) {
      reviewStream.once("drain", writing);
    } else if (!restOK) {
      restStream.once("drain", writing);
    } else {
      userStream.once("drain", writing);
    }
  }
}
writing();

