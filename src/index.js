import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'

import Stars from './stars'
import PineTrees from './trees'
import Snow from './snow'

class WinterScene extends React.Component {
  render(){ 
    return (
      <div>
        <Stars />
        <PineTrees />
        <Snow />
      </div>
    )
  }
}

ReactDOM.render(<WinterScene />, document.getElementById('root'))

window.addEventListener('touchmove', e => {
  e.preventDefault()
}, {passive: false})