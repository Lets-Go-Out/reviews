import React from 'react';
import PropTypes from 'prop-types';

const Stars = (props) => {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    stars.push(i <= props.num ? '\u2605' : '\u2606');
  }
  return (
    <span>
      {stars.join(' ')}
    </span>);
};

Stars.defaultProps = {
  num: 0,
};

Stars.propTypes = {
  num: PropTypes.number,
};

export default Stars;
