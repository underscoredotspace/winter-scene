import React from 'react'
import {rnd, SVGNS} from './globals'

export default class Stars extends React.Component {
    state = {stars: []}
    
    makeStars = () => {
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
  
    componentDidMount = () => {
       window.addEventListener("resize", this.makeStars)
       this.makeStars()
    }
  
    render = () =>(
      <div className="star-field" ref={n=>(this.node=n)}>
        {this.state.stars.map((star, ndx) => (
          <Star {...star} key={`star-${ndx}`} />
        ))}
      </div>
    )
  }
  
  class Star extends React.Component {
    constructor(props) {
      super(props)
      const s = props.size
  
      const starStyle = {
        top: `${props.y}px`,
        left: `${props.x}px`,
        width: `${s}px`,
        height: `${s}px`,
        transform: `rotate(${props.rotation}deg)`,
        animation: `twinkle ${props.cycleTime}s infinite`
      }
  
      const points = `0,${(s / 3).toFixed(2)} 
        ${s},${(s / 3).toFixed(2)} 
        ${(s / 6).toFixed(2)},${s} 
        ${(s / 2).toFixed(2)},0 
        ${s - (s / 6).toFixed(2)},${s}`
  
      this.state = {
        points,
        starStyle,
        vb: `0 0 ${this.props.size} ${this.props.size}`
      }
    }
  
    render = ()  => (
      <svg className="star" xmlns={SVGNS} style={this.state.starStyle} viewBox={this.state.vb}>
        <polygon className="star" xmlns={SVGNS} points={this.state.points} />
      </svg>
    )
  }