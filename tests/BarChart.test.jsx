/* eslint-env jest */

import React from 'react';
import { render } from 'enzyme';
import BarChart from '../client/BarChart.jsx';

const fakeStarsCount = {
  5: 0.6,
  4: 0.2,
  3: 0.05,
  2: 0.05,
  1: 0.2,
};

const wrapper = render(<BarChart proportions={fakeStarsCount} />);

it('renders five bars', () => {
  expect(wrapper.find('.barContainer')).toHaveLength(5);
});

it('renders bars with widths corresponding to the values supplied as props', () => {
  const firstWidth = fakeStarsCount[5] * 100;
  expect(wrapper.find('.barForeground')[0]).toHaveProperty('attribs.style', `width:${firstWidth}%`);
});
