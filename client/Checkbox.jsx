/* eslint-env commonjs, browser */

import React from 'react';

const Checkbox = ({ label, onChange, status }) => (
  <div>
    <input type="checkbox" checked={status} onChange={onChange} />
    {label}
  </div>
);

export default Checkbox;
