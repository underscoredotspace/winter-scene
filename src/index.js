import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const SVGNS = 'http://www.w3.org/2000/svg'

class WinterScene extends React.Component {
  render() {
    return (
      <div>
        <StarField />
        <Snow />
      </div>
    )
  }
}

class Snow extends React.Component {
  componentDidMount() {

  }

  render() {
    const vb = `0 0 ${window.innerWidth} ${window.innerHeight}`
    return (
      <svg className="snow" xmlns={SVGNS} viewBox={vb}>
        <circle className="snow" cx="100" cy="100" r="1"/>
      </svg>
    )
  }
}

class StarField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stars: []
    };
  
    window.addEventListener("resize", this.makeStars.bind(this));
  }
  
  makeStars() {
    this.starFieldElement = document.querySelector('.star-field')
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    const width = this.starFieldElement.clientWidth,
      height = this.starFieldElement.clientHeight,
      starDensity = height * width / 2000,
      stars = []

    for (let ndx = 0; ndx < starDensity; ndx++) {
      const { y, size, cycleTime, rotation } = {
        y: rnd(-10, height),
        size: rnd(1, 15),
        cycleTime: rnd(5, 20),
        rotation: rnd(0, 359)
      };
      stars.push(
        <Star
          x={rnd(-10, width)}
          y={y}
          size={size}
          rotation={rotation}
          cycleTime={cycleTime}
          key={`star-${ndx}`}
        />
      );
    }

     this.setState({stars: []}, () => this.setState({stars}))
  }
  

  componentDidMount() {
    this.makeStars();
  }

  render() {
    return (
      <div className="star-field">
        {this.state.stars}
      </div>
    );
  }
}

class Star extends React.Component {
  constructor(props) {
    super(props);
    const s = props.size;

    const starStyle = {
      top: `${props.y}px`,
      left: `${props.x}px`,
      width: `{${s}px`,
      height: `${s}px`,
      transform: `rotate(${props.rotation}deg)`,
      animation: `twinkle ${props.cycleTime}s infinite`
    };

    this.state = {
      points: `0,${(s / 3).toFixed(2)} ${s},${(s / 3).toFixed(2)} ${(s / 6
      ).toFixed(2)},${s} ${(s / 2).toFixed(2)},0 ${s -
        (s / 6).toFixed(2)},${s}`,
      starStyle,
      vb: `0 0 ${this.props.size} ${this.props.size}`
    };
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
    );
  }
}

ReactDOM.render(
  <WinterScene />, document.getElementById('root')
)