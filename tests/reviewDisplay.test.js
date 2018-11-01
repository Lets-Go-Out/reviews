/* eslint-env jest browser*/

import React from 'react';
import Enzyme from 'enzyme';
import Review from '../client/reviewDisplay.jsx';
import sampleReviews from './sampleReviews.json';

const sampleReview = JSON.parse(sampleReviews)[0];
const { render } = Enzyme;

const wrapper = render(<Review data={sampleReview} key="0" />);

it('displays a review', () => {
  
});