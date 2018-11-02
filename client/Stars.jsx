import React from 'react';
import PropTypes from 'prop-types';

const Stars = (props) => {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    stars.push(i <= props.num ? <div className="fullStar">{'\u2605'}</div> : <div className="emptyStar">{'\u2605'}</div>);
  }
  return (
    <div className="stars">
      {stars}
    </div>);
};

Stars.defaultProps = {
  num: 0,
};

Stars.propTypes = {
  num: PropTypes.number,
};

export default Stars;
