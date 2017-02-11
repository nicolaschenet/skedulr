/* eslint no-undef:off */
import './Home.css';

import FlatButton from 'material-ui/FlatButton';
import React from 'react';

export default function Home () {
  return (
    <div className='Home'>
      <h2 className='Home-Header'>
        <span className='Home-Header--title'>Skedulr</span>
        is coming
      </h2>
      <FlatButton 
        label="View an example party" 
        secondary={true} 
        href='parties/-KcVQxXvUq8Coac1iixz'
      />
    </div> 
  )
}
