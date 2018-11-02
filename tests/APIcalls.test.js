/* eslint-env jest */

import APICalls from '../client/APICalls.js';

global.fetch = jest.fn();

global.fetch.mockResolvedValue({});

it('makes calls to fetch', () => {
  APICalls.getReviews();
  expect(global.fetch).toHaveBeenCalledTimes(1);
  APICalls.getBasicInfo();
  expect(global.fetch).toHaveBeenCalledTimes(2);
  APICalls.markHelpful();
  expect(global.fetch).toHaveBeenCalledTimes(3);
  APICalls.report();
  expect(global.fetch).toHaveBeenCalledTimes(4);
});
