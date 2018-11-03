/* eslint-env jest */

import React from 'react';
import Enzyme from 'enzyme';
import fs from 'fs';
import path from 'path';
import Review from '../client/reviewDisplay.jsx';
import API from '../client/APICalls.js';

const sampleReview = JSON.parse(fs.readFileSync(path.join(__dirname, '/sampleReviews.json')))[0];
const { shallow } = Enzyme;

jest.mock('../client/APICalls.js');

Review.prototype.checkReviewLength = jest.fn();


const wrapper = shallow(<Review data={sampleReview} key="1" />);

it('displays stars for the overall rating', () => {
  expect(wrapper.find('Stars')).toHaveLength(1);
});

it('checks review length when window is resized', () => {
  wrapper.simulate('resize');
  expect(Review.prototype.checkReviewLength).toHaveBeenCalled();
});

it('toggles review length when read more / less button is clicked', () => {
  const instance = wrapper.instance();
  expect(instance.state.expanded).toBe(false);
  instance.readMoreHandler();
  expect(instance.state.expanded).toBe(true);
  wrapper.find('.readMore').simulate('click');
  expect(instance.state.expanded).toBe(false);
});

it('does not display a read more button when the review is short', () => {
  expect(wrapper.find('button')).toHaveLength(3);
  wrapper.setState({ long: false });
  expect(wrapper.find('button')).toHaveLength(2);
});

it('sends API requests when reviews are reported or marked helpful', () => {
  const instance = wrapper.instance();
  instance.report();
  expect(API.report).toBeCalled();
  instance.markHelpful();
  expect(API.markHelpful).toBeCalled();
});

it('calls functions to report reviews or mark them helpful when the appropriate buttons are clicked', () => {
  Review.prototype.markHelpful = jest.fn();
  Review.prototype.report = jest.fn();
  wrapper.find('.markHelpful').simulate('click');
  expect(Review.prototype.markHelpful).toHaveBeenCalled();
  wrapper.find('.report').simulate('click');
  expect(Review.prototype.report).toHaveBeenCalled();
});


