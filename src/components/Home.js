import './Home.css'

import FlatButton from 'material-ui/FlatButton'
import React from 'react'
import rocket from '../images/rocket.svg'

export default function Home () {
  return (
    <div className='Home'>
      <div></div>
      <div>
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
      <img src={rocket} />
    </div> 
  )
}
