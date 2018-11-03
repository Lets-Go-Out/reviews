/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import Stars from '../client/Stars.jsx';

it('returns a div containing five divs', () => {
  const wrapper = shallow(<Stars num={4} />);
  expect(wrapper.find('div')).toHaveLength(6);
});

it('returns the correct number of stars', () => {
  const wrapper = shallow(<Stars num={4.5} />);
  expect(wrapper.find('.fullStar')).toHaveLength(4);
  expect(wrapper.find('.halfStar')).toHaveLength(1);
  const newWrapper = shallow(<Stars num={3.25} />);
  expect(newWrapper.find('.fullStar')).toHaveLength(3);
  expect(newWrapper.find('.quarterStar')).toHaveLength(1);
});
