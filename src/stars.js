import React from 'react'
import {rnd, SVGNS} from './globals'

export default class Stars extends React.Component {
  constructor(props) {
    super(props)
    this.state = {stars: []}
  }
    
  makeStars() {
    this.width = this.node.clientWidth
    this.height = this.node.clientHeight
    this.starDensity = this.height * this.width / 7000
    
    let stars = []
    
    for (let ndx = 0; ndx < this.starDensity; ndx++) {
      stars.push({
        x: rnd(-30, this.width),
        y: rnd(-30, this.height-30),
        size: rnd(15, 30),
        cycleTime: rnd(5, 20),
        rotation: rnd(0, 359)
      })
    }
    
    this.setState({stars})
  }

  componentDidMount() {
    window.addEventListener("resize", this.makeStars)
    this.makeStars()
  }

  render() {
    return (
      <div className="star-field" ref={n=>(this.node=n)}>
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
      top: `${props.y}px`,
      left: `${props.x}px`,
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
      <svg className="star" xmlns={SVGNS} style={this.state.starStyle} viewBox="0 0 30 30">
        <polygon className="star" points="0,10.00 30,10.00 5.00,30 15.00,0 25,30"></polygon>
      </svg>
    )
  }
}