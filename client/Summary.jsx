import React from 'react';
import Stars from './Stars.jsx';
import BarChart from './BarChart.jsx';

const Summary = ({ info, starsCount, changeSort }) => {
  return (
    <div>
      <div>
        <h2>
          {`What ${info.numReviews} People Are Saying`}
        </h2>
      </div>
      <div>
        Overall Ratings and Reviews
      </div>
      <div>
        <Stars num={Math.round(info.recent)} />
        {` ${info.recent.toFixed(2)} based on recent ratings`}
      </div>
      <div>
        {`${info.foodAvg.toFixed(2)} Food`}
      </div>
      <div>
        {`${info.serviceAvg.toFixed(2)} Service`}
      </div>
      <div>
        {`${info.ambienceAvg.toFixed(2)} Ambience`}
      </div>
      <div>
        {`${info.valueAvg.toFixed(2)} Value`}
      </div>
      <BarChart proportions={starsCount} />
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
};

export default Summary;
