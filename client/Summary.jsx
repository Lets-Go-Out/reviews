import React from 'react';
import PropTypes from 'prop-types';
import Stars from './Stars';
import BarChart from './BarChart';
import styles from './style.css';

const Summary = ({ info, starsCount, changeSort }) => (
  <div className={styles.summaryContainer}>
    <div>
      <div className={styles.peopleAreSaying}>
        {`What ${info.numReviews} People Are Saying`}
      </div>
    </div>
    <div className={styles.statsContainer}>
      <div className={styles.overallContainer}>
        <div className={styles.mediumBold}>
          Overall Ratings and Reviews
        </div>
        <div>
          Reviews can only be made by diners who have eaten at this restaurant
        </div>
        <div className={styles.mainStars}>
          <Stars num={info.recent} />
          <div>
            {` ${info.recent.toFixed(2)} based on recent ratings`}
          </div>
        </div>
        <div className={styles.averages}>
          <div>
            <div className={styles.mediumBold}>
              {info.foodAvg.toFixed(2)}
            </div>
            <div>
              Food
            </div>
          </div>
          <div>
            <div className={styles.mediumBold}>
              {info.serviceAvg.toFixed(2)}
            </div>
            <div>
              Service
            </div>
          </div>
          <div>
            <div className={styles.mediumBold}>
              {info.ambienceAvg.toFixed(2)}
            </div>
            <div>
              Ambience
            </div>
          </div>
          <div>
            <div className={styles.mediumBold}>
              {info.valueAvg.toFixed(2)}
            </div>
            <div>
               Value
            </div>
          </div>
        </div>
      </div>
      <BarChart proportions={starsCount} />
    </div>
    <div>
      Sort by
      <br />
      <select className={styles.sortSelector} onChange={changeSort}>
        <option value="date">
          Newest
        </option>
        <option value="best">
          Highest rating
        </option>
        <option value="worst">
          Lowest rating
        </option>
      </select>
    </div>
  </div>
);

Summary.propTypes = {
  info: PropTypes.shape({
    numReviews: PropTypes.number,
    recent: PropTypes.number,
    foodAvg: PropTypes.number,
    serviceAvg: PropTypes.number,
    valueAvg: PropTypes.number,
    ambienceAvg: PropTypes.number,
  }).isRequired,
  starsCount: PropTypes.shape({
    5: PropTypes.number,
    4: PropTypes.number,
    3: PropTypes.number,
    2: PropTypes.number,
    1: PropTypes.number,
  }).isRequired,
  changeSort: PropTypes.func.isRequired,
};


export default Summary;
