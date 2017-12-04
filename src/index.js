import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const SVGNS = 'http://www.w3.org/2000/svg'

class WinterScene extends React.Component {
  render() {
    return (
      <div>
        <StarField stars="200" />
      </div>
    )
  }
}

class StarField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stars: []
    }
  }
  
  componentDidMount() { 
    const rnd = (min, max) => Math.floor(Math.random()*(max-min+1)+min)

    const width = window.innerWidth,
      height = window.innerHeight*(2/3),
      starDensity = (height*width)/2000,
      stars = []
    
    for (let ndx=0; ndx<starDensity; ndx++) {
      const {x, y, size, cycleTime, rotation} = {
        x:rnd(-10, width), 
        y:rnd(-10, height), 
        size:rnd(1, 15),
        cycleTime:rnd(5, 20),
        rotation:rnd(0, 359)
      }
      stars.push(<Star x={x} y={y} size={size} 
          rotation={rotation} 
          cycleTime={cycleTime} 
          key={`star-${ndx}`} />)
    }

    this.setState({stars})
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
      top: `${this.props.y}px`, 
      left: `${this.props.x}px`, 
      width: `{${this.props.size}px`, 
      height: `${this.props.size}px`,
      transform: `rotate(${this.props.rotation}deg)`,
      animation: `twinkle ${this.props.cycleTime}s infinite`}
    
    this.state = {
      points: `0,${(s/3).toFixed(2)} ${s},${(s/3).toFixed(2)} ${(s/6).toFixed(2)},${s} ${(s/2).toFixed(2)},0 ${s-(s/6).toFixed(2)},${s}`,
      colour: 'lightyellow',
      starStyle
    }
    
  }
  render() {
    const vb = `0 0 ${this.props.size} ${this.props.size}`
    return (<svg className="star" xmlns={SVGNS} style={this.state.starStyle} viewBox={vb}>
        <polygon xmlns={SVGNS}
          points={this.state.points}
          fill='none' stroke={this.state.colour}>
        </polygon>
    </svg>)
  }
}


ReactDOM.render(
  <WinterScene />, document.getElementById('root')
)