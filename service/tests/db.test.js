/* eslint-env jest */

const db = require('../server/db/db.js');

// afterAll(() => db.closeConnection(() => console.log('connection closed')));

test('it gets basic data about a restaurant', (done) => {
  const testCb = (err, data) => {
    expect(err).toBe(null);
    expect(typeof data).toBe('object');
    expect(data.length).toBe(1);
    expect(data[0].id).toBe(5);
    done();
  };

  db.getBasicInfo(5, testCb);
});

test('it gets reviews for a restaurant', (done) => {
  const testCb = (err, data) => {
    expect(err).toBe(null);
    expect(typeof data).toBe('object');
    expect(data.length).toBeGreaterThan(1);
    expect(data[0].restaurant).toBe(10);
    done();
  };

  db.getReviews(10, testCb);
});
