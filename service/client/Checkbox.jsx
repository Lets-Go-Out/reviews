/* eslint-env commonjs, browser */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.css';

const Checkbox = ({ label, onChange, status }) => (
  <div className={styles.checkboxWrapper}>
    <button type="button" className={status ? `${styles.checkbox} ${styles.checked}` : styles.checkbox} onClick={onChange}>
      <input type="checkbox" checked={status} onChange={onChange} />
      {label}
    </button>
  </div>
);

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  status: PropTypes.bool.isRequired,
};

export default Checkbox;
