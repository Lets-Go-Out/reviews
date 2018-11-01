/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import BarChart from '../client/BarChart.jsx';

const fakeStarsCount = {
  5: 0.6,
  4: 0.2,
  3: 0.05,
  2: 0.05,
  1: 0.2,
};

it('renders five bars', () => {
  const wrapper = shallow(<BarChart proportions={fakeStarsCount} />);
  expect(wrapper.find('.barContainer')).toHaveLength(5);
});
