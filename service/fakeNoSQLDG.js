const faker = require("faker");
const fs = require("fs");
const Uuid = require('cassandra-driver').types.Uuid;

faker.seed(105);

const createFakeRestaurant = i => {
  const fakeRestaurant = { id: Uuid.random().toString() };
  const fakeWords = [];
  const length = faker.random.number() % 3;

  for (let idx = 0; idx <= length; idx += 1) {
    fakeWords.push(faker.random.word());
  }

  fakeRestaurant.name = fakeWords.join(" ");
  return fakeRestaurant;
};

const fakeUserGenerator = i => {
  const fakeUser = { id: Uuid.random().toString() };
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

const fakeReviewGenerator = (reviewid, restaurantId) => ({
  reviewid,
  userid: faker.random.number(10000000) + 1,
  overallrating: ratingGenerator(),
  foodrating: ratingGenerator(),
  servicerating: ratingGenerator(),
  ambiencerating: ratingGenerator(),
  valuerating: ratingGenerator(),
  wyr: faker.random.number(4) !== 4 ? 1 : 0,
  date: new Date(faker.date.recent(400)).toISOString(),
  partysize: faker.random.number(6) + 2,
  text: fakeReviewTextGenerator(),
  timesreported: 0,
  timesmarkedhelpful: 0
});

const newAvg = (newVal, avg, newNumOfThings) => {
  const oldTotal = avg * (newNumOfThings - 1);
  return (oldTotal + newVal) / newNumOfThings;
};

const addReviews = (rest, fakeReviews, revCount) => {
  const numreviews = faker.random.number(6) + 1;

  for (let idx = 0; idx < numreviews; idx += 1) {
    const review = fakeReviewGenerator(revCount + idx + 1, rest.id);
    const {
      overallrating,
      foodrating,
      servicerating,
      ambiencerating,
      valuerating,
      wyr
    } = review;
    if (!rest.numreviews) {
      Object.assign(rest, {
        numreviews: 1,
        overallrating,
        foodrating,
        servicerating,
        ambiencerating,
        valuerating,
        wyr: wyr ? 100 : 0
      });
    } else {
      rest.numreviews += 1;
      rest.overallrating = newAvg(
        overallrating,
        rest.overallrating,
        rest.numreviews
      );
      rest.foodrating = newAvg(foodrating, rest.foodrating, rest.numreviews);
      rest.servicerating = newAvg(
        servicerating,
        rest.servicerating,
        rest.numreviews
      );
      rest.ambiencerating = newAvg(
        ambiencerating,
        rest.ambiencerating,
        rest.numreviews
      );
      rest.valuerating = newAvg(valuerating, rest.valuerating, rest.numreviews);
      rest.wyr = newAvg(wyr ? 100 : 0, rest.wyr, rest.numreviews);
    }
    fakeReviews.push(review);
  }
};

const restaurantCols = [
  "id",
  "name",
  "overallrating",
  "foodrating",
  "servicerating",
  "ambiencerating",
  "valuerating",
  "wyr",
  "numreviews",
  "reviews"
];

const userCols = ["id", "name", "numReviews", "location"];

const toCSV = (obj, arrayOfColNames) => {
  const row = [];
  arrayOfColNames.forEach((colName, i) => {
    if (i === 0) {
      row.push(`\n'${obj[colName]}'`);
    } else if (colName === "reviews") {
      // let str = "[";
      // obj[colName].forEach(reviewObj => {
      //   str += '{';
      //   for (let prop in reviewObj) {
      //     if (prop === 'text') {
      //       str += `${prop}: ${JSON.stringify(reviewObj[prop])}, `;
      //     } else {
      //       str += `${prop}: ${reviewObj[prop]}, `;
      //     }
      //   }
      //   str = str.slice(0, str.length - 2);
      //   str += '}, ';
      // })
      // str = str.slice(0, str.length - 2);
      // str += "]";
      let str = JSON.stringify(obj[colName]);
      row.push(`'${str}'`);
    } else if (colName === "name") {
      row.push(`'${obj[colName]}'`);
    } else {
      row.push(`'${obj[colName]}'`);
    }
  });
  return row.join("#");
};

let restStream = fs.createWriteStream("./restTest.csv");
let userStream = fs.createWriteStream("./usersTest.csv");

const LIMIT = 100;
let i = 1;
let reviewCount = 0;
restStream.write(restaurantCols.slice().join("#"));
userStream.write(userCols.slice().join("#"));

function writing(callback) {
  let restOK = true,
    userOK = true;
  do {
    let fakeReviews = [];
    let rest = createFakeRestaurant(i);
    addReviews(rest, fakeReviews, reviewCount);
    Object.assign(rest, { reviews: fakeReviews });
    let user = fakeUserGenerator(i);
    i++;
    reviewCount += fakeReviews.length;
    if (i % 1000 === 0) console.log(i);
    if (i % 10000 === 0) {
      console.clear();
    }
    if (i === LIMIT) {
      restStream.write(toCSV(rest, restaurantCols), "utf8", callback);
      userStream.write(toCSV(user, userCols), "utf8", callback);
    } else {
      restOK = restStream.write(toCSV(rest, restaurantCols));
      userOK = userStream.write(toCSV(user, userCols));
    }
  } while (i <= LIMIT && restOK && userOK);
  if (i < LIMIT) {
    if (!restOK) {
      restStream.once("drain", writing);
    } else {
      userStream.once("drain", writing);
    }
  }
}
writing();

