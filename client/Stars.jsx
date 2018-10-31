import React from 'react';

const Stars = (props) => {
  let stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push (i <= props.num ? '\u2605' : '\u2606');
  }
  return (<span>{stars.join(' ')}</span>);
};

export default Stars;