import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const SVGNS = 'http://www.w3.org/2000/svg'
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

class WinterScene extends React.Component {
  render() {
    return (
      <div>
        <Stars />
        <Snow />
      </div>
    )
  }
}

class Snow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {flakes:[]}
    this.makeFlakes = this.makeFlakes.bind(this)
    window.addEventListener("resize", this.makeFlakes)
  }

  componentDidMount() {
    this.makeFlakes()
  }

  makeFlakes() {
    const width = window.innerWidth, 
      snowDensity = window.innerWidth * width / 6000
    let flakes = []
    for(let ndx = 0; ndx < snowDensity; ndx++) {
      const flake = {
        "left":`${rnd(-30,width)}px`, 
        "animationDuration": `${rnd(10,15)}s`,
        "animationDelay": `${rnd(0,15)}s`,
        "fontSize": `${rnd(10,25)}px`
      }
      flakes[ndx] = flake
    }
    this.setState({
      flakes,
      vb: `0 0 ${window.innerWidth} ${window.innerHeight}`
    })
  }
  
  render() {
    return (
      this.state.flakes.map((style, ndx) => 
        <b className="snow-flake" style={style} key={`flake-${ndx}`}>*</b>
       )
    )
  }
}

class Stars extends React.Component {
  state = {stars: []}
  
  makeStars = () => {
    this.starFieldElement = document.querySelector('.star-field')

    const width = this.starFieldElement.clientWidth,
      height = this.starFieldElement.clientHeight,
      starDensity = height * width / 5000
    let stars = []

    for (let ndx = 0; ndx < starDensity; ndx++) {
      const { y, size, cycleTime, rotation } = {
        y: rnd(-10, height),
        size: rnd(1, 15),
        cycleTime: rnd(5, 20),
        rotation: rnd(0, 359)
      }
      stars.push(
        <Star
          x={rnd(-10, width)}
          y={y}
          size={size}
          rotation={rotation}
          cycleTime={cycleTime}
          key={`star-${ndx}`}
        />
      )
    }

     this.setState({stars: []}, () => this.setState({stars}))
  }
  
  componentDidMount() {
    this.makeStars()
    window.addEventListener("resize", this.makeStars)
  }

  render() {
    return (
      <div className="star-field">
        {this.state.stars}
      </div>
    )
  }
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

    this.state = {
      points: `0,${(s / 3).toFixed(2)} ${s},${(s / 3).toFixed(2)} ${(s / 6
      ).toFixed(2)},${s} ${(s / 2).toFixed(2)},0 ${s -
        (s / 6).toFixed(2)},${s}`,
      starStyle,
      vb: `0 0 ${this.props.size} ${this.props.size}`
    }
  }

  render() {
    return (
      <svg
        className="star"
        xmlns={SVGNS}
        style={this.state.starStyle}
        viewBox={this.state.vb}
      >
        <polygon className="star" xmlns={SVGNS} points={this.state.points} />
      </svg>
    )
  }
}

ReactDOM.render(
  <WinterScene />, document.getElementById('root')
)