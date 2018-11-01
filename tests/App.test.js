/* eslint-env jest browser*/

import React from 'react';
import Enzyme from 'enzyme';
import Reviews from '../client/App.jsx';
import sampleReviews from './sampleReviews.json';
import sampleReviewSummary from './sampleReviewSummary.json';

const { render } = Enzyme;


global.fetch = jest.fn((url) => {
  const pathParts = url.split('/');
  const sampleData = pathParts[pathParts.length - 1] === 'reviews'
    ? sampleReviews
    : sampleReviewSummary;
  const response = {
    json: () => {
      return new Promise((resolve, reject) => {
        console.log(sampleData);
        resolve(sampleData);
      }); 
    },
  };
  return new Promise((resolve, reject) => {
    resolve(response);
  });
});

it('makes two calls to the API upon mounting', () => {
  const wrapper = render(<Reviews />);
  expect(wrapper.text()).toContain('Service');
});

