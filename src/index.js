import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import Stars from './stars'
import {PineTrees, MobileTree} from './trees'
import Snow from './snow'

class WinterScene extends React.Component {
  render = () => (
    <div>
      <Stars />
      <PineTrees />
      <Snow />
    </div>
  )
}

class WinterSceneMobile extends React.Component {
  render = () => <div>
    <Stars />
    <MobileTree />
    <Snow />
  </div>
}

const hashChange = () => {
  if (window.location.hash === '#mobile') {
    ReactDOM.render(
      <WinterSceneMobile />, document.getElementById('root')
    )  
  } else {
    ReactDOM.render(
      <WinterScene />, document.getElementById('root')
    )
  }
}

hashChange()
window.addEventListener('hashchange', hashChange)
window.addEventListener('touchmove', e => {e.preventDefault()}, {passive: false})