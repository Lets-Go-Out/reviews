/* eslint-env jest */

import fs from 'fs';
import path from 'path';
import React from 'react';
import Enzyme from 'enzyme';
import Reviews from '../client/App.jsx';
import APICalls from '../client/APICalls.js';

const { shallow } = Enzyme;

const fakeReviews = JSON.parse(fs.readFileSync(path.join(__dirname, '/sampleReviews.json')));
const fakeInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '/sampleReviewSummary.json')));
const randoId = '5';

jest.mock('../client/APICalls.js');

APICalls.getReviews.mockImplementation((id, cb) => cb(fakeReviews));
APICalls.getBasicInfo.mockImplementation((id, cb) => cb(fakeInfo));


it('makes two calls to the API upon mounting', () => {
  const wrapper = shallow(<Reviews id={randoId} />);
  expect(APICalls.getBasicInfo).toBeCalled();
  expect(APICalls.getReviews).toBeCalled();
  wrapper.unmount();
});

it('sorts reviews according to the currently selected parameter', () => {
  const wrapper = shallow(<Reviews id={randoId} />);
  wrapper.update();
  const instance = wrapper.instance();
  instance.componentDidMount();
  instance.changeSort('date');
  const { reviews } = instance.state;
  expect(reviews[0].date - reviews[reviews.length - 1].date).toBeGreaterThan(0);
  instance.changeSort('best');
  expect(reviews[0].overall).toBeGreaterThan(reviews[reviews.length - 1].overall);
  instance.changeSort('worst');
  expect(reviews[0].overall).toBeLessThan(reviews[reviews.length - 1].overall);
});

it('renders a summary', () => {
  const wrapper = shallow(<Reviews id={randoId} />);
  wrapper.update();
  expect(wrapper.find('Summary')).toHaveLength(1);
});


// it('displays basic info about a restaurant\'s reviews', () => {
//   const wrapper = mount(<Reviews id="3"/>);
//   wrapper.update();
//   expect(wrapper.text()).toContain('Ambience');
//   wrapper.unmount();
// });
