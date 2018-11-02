/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import Stars from '../client/Stars.jsx';

const num = 4;

it('returns a span', () => {
  const wrapper = shallow(<Stars num={num} />);
  expect(wrapper.find('span')).toHaveLength(1);
});
