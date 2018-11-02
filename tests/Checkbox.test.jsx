/* eslint-env jest */

import React from 'react';
import Checkbox from '../client/Checkbox.jsx';
import { shallow } from 'enzyme';

const fakeChange = jest.fn();
let isChecked = false;

const wrapper = shallow(<Checkbox onChange={fakeChange} status={isChecked}/>);

it('contains a checkbox', () => {
  expect(wrapper.find('input')).toHaveLength(1);
});

it('calls its onChange function when changed', () => {
  wrapper.find('input').first().simulate('change');
  expect(fakeChange).toHaveBeenCalled();
});
