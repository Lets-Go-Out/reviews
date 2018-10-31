import React from 'react';

const BarChart = (props) => {
  const bars = [];
  for (let i = 5; i > 0; i--) {
    const width = props.proportions[i] * 100 || 0;
    const style = {width: `${width}%`};
    bars.push(<div className="barContainer">{i} <div key={i} className="barBackground"><div className="barForeground" style={style}></div></div></div>);
  }
  return <div>{bars}</div>;
};

export default BarChart;