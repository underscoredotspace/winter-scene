import React from 'react'
import {rnd} from './globals'

export default class Stars extends React.Component {
  constructor(props) {
    super(props)
    this.state = { stars: []}

    this.makeStars = this.makeStars.bind(this)
  }

  makeStars() {
    this.starDensity = (window.innerHeight * 0.7) * window.innerWidth / 3000

    let stars = []

    for (let ndx = 0; ndx < this.starDensity; ndx++) {
      const size = rnd(2,20)
      stars.push({
        x: `calc(${rnd(0,100)}% - ${size/2}px)`,
        y: `calc(${rnd(0,100)}% - ${size/2}px)`,
        size,
        cycleTime: rnd(5, 20),
        rotation: rnd(0, 359)
      })
    }

    this.setState({ stars })
  }

  componentDidMount() {
    window.addEventListener("resize", this.makeStars)
    this.makeStars()
  }

  render() {
    return (
      <div className="star-field">
        {this.state.stars.map((star, ndx) => (
          <Star {...star} key={`star-${ndx}`} />
        ))}
      </div>
    )
  }
}

class Star extends React.Component {
  constructor(props) {
    super(props)

    const starStyle = {
      top: props.y,
      left: props.x,
      width: `${props.size}px`,
      height: `${props.size}px`,
      transform: `rotate(${props.rotation}deg)`,
      animationDuration: `${props.cycleTime}s`
    }

    this.state = {
      starStyle
    }
  }

  render() {
    return (
      <svg className="star" xmlns='http://www.w3.org/2000/svg' style={this.state.starStyle} viewBox="0 0 30 30">
        <polygon className="star" points="0,10.00 30,10.00 5.00,30 15.00,0 25,30"></polygon>
      </svg>
    )
  }
}