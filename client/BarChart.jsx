import React from 'react';
import styles from './style.css';

const BarChart = ({ proportions }) => {
  const bars = [];
  for (let i = 5; i > 0; i -= 1) {
    const width = proportions[i] * 100 || 0;
    const style = { width: `${width}%` };
    bars.push(
      <div key={i} className={styles.barContainer}>
        <div>
          {i}
        </div>
        <div className={styles.barBackground}>
          <div className={styles.barForeground} style={style} />
        </div>
      </div>,
    );
  }
  return (
    <div className={styles.barChart}>
      {bars}
    </div>
  );
};

export default BarChart;
