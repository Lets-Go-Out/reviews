/* eslint-env jest */

import fs from 'fs';
import path from 'path';
import React from 'react';
import Enzyme from 'enzyme';
import Reviews from '../client/App.jsx';
import APICalls from '../client/APICalls.js';

const { mount } = Enzyme;

const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '/sampleReviews.json')));
const info = JSON.parse(fs.readFileSync(path.join(__dirname, '/sampleReviewSummary.json')));

jest.mock('../client/APICalls.js');

APICalls.getReviews.mockResolvedValue(reviews);
APICalls.getBasicInfo.mockResolvedValue(info);


it('makes two calls to the API upon mounting', () => {
  const wrapper = mount(<Reviews />);
  expect(APICalls.getBasicInfo).toBeCalled();
  expect(APICalls.getReviews).toBeCalled();
  wrapper.unmount();
});

// it('displays basic info about a restaurant\'s reviews', () => {
//   const wrapper = mount(<Reviews id="3"/>);
//   wrapper.update();
//   expect(wrapper.text()).toContain('Ambience');
//   wrapper.unmount();
// });
