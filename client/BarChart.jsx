import React from 'react';

const BarChart = ({ proportions }) => {
  const bars = [];
  for (let i = 5; i > 0; i -= 1) {
    const width = proportions[i] * 100 || 0;
    const style = { width: `${width}%` };
    bars.push(
      <div key={i} className="barContainer">
        <div>
          {i}
        </div>
        <div className="barBackground">
          <div className="barForeground" style={style} />
        </div>
      </div>,
    );
  }
  return (
    <div className="barChart">
      {bars}
    </div>
  );
};

export default BarChart;
