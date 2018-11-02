import React from 'react';
import Stars from './Stars.jsx';
import BarChart from './BarChart.jsx';

const Summary = ({ info, starsCount, changeSort }) => (
  <div className="summaryContainer">
    <div>
      <div className="peopleAreSaying">
        {`What ${info.numReviews} People Are Saying`}
      </div>
    </div>
    <div className="statsContainer">
      <div className="overallContainer">
        <div className="mediumBold">
          Overall Ratings and Reviews
        </div>
        <div>
          Reviews can only be made by diners who have eaten at this restaurant
        </div>
        <div className="mainStars">
          <Stars num={Math.round(info.recent)} />
          {` ${info.recent.toFixed(2)} based on recent ratings`}
        </div>
        <div className="averages">
          <div>
            <div className="mediumBold">
              {info.foodAvg.toFixed(2)}
            </div>
            <div>
              Food
            </div>
          </div>
          <div>
            <div className="mediumBold">
              {info.serviceAvg.toFixed(2)}
            </div>
            <div>
              Service
            </div>
          </div>
          <div>
            <div className="mediumBold">
              {info.ambienceAvg.toFixed(2)}
            </div>
            <div>
              Ambience
            </div>
          </div>
          <div>
            <div className="mediumBold">
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
      <select className="sortSelector" onChange={changeSort}>
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


export default Summary;
