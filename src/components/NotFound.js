import './NotFound.css';

import React from 'react';
import seagul from '../images/seagul.svg'

export default function NotFound () {
  return (
    <div className="NotFound">
      <h1 className="NotFound-Header">
        <span className="NotFound-Header--code">404</span> 
        You're lost
      </h1>
      <img src={seagul} />
    </div>
  )
}
