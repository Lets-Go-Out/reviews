import React from 'react';
import PropTypes from 'prop-types';

const Stars = ({ num }) => {
  const numStars = Math.round(num * 4) / 4;
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    // stars.push(i <= numStars ? <div className="fullStar">{'\u2605'}</div> : <div className="emptyStar">{'\u2605'}</div>);
    if (i <= numStars) {
      stars.push(<div className="fullStar star" />);
    } else if (i - numStars === 0.25) {
      stars.push(<div className="threeQuarterStar star" />);
    } else if (i - numStars === 0.5) {
      stars.push(<div className="halfStar star" />);
    } else if (i - numStars === 0.75) {
      stars.push(<div className="quarterStar star" />);
    } else {
      stars.push(<div className="emptyStar star" />);
    }
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
