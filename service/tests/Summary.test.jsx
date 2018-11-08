/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import fs from 'fs';
import path from 'path';
import Summary from '../client/Summary.jsx';

const fakeStarsCount = {
  5: 0.6,
  4: 0.2,
  3: 0.05,
  2: 0.05,
  1: 0.2,
};

const fakeInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '/sampleReviewSummary.json')));
Object.assign(fakeInfo, { recent: 4 });


const fakeChangeSort = jest.fn();

const wrapper = shallow(
  <Summary info={fakeInfo} starsCount={fakeStarsCount} changeSort={fakeChangeSort} />,
);

it('renders a bar chart', () => {
  expect(wrapper.find('BarChart')).toHaveLength(1);
});

it('renders a display of stars', () => {
  expect(wrapper.find('Stars')).toHaveLength(1);
});

it('calls the function to change sorts when the selector is changed', () => {
  wrapper.find('.sortSelector').simulate('change');
  expect(fakeChangeSort).toBeCalled();
});
