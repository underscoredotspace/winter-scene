import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const SVGNS = 'http://www.w3.org/2000/svg'
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

class PineTree extends React.Component {
  state = {lines:[]}

  setSize = () => {
    this.outer = this.node.getBoundingClientRect()
    const viewBox = `0 0 ${this.outer.width} ${this.outer.height}`
    this.setState({viewBox})
  }

  getLine = (x1, y1, angle, length) => {
    let {x2,y2} = this.lineEnd(x1, y1, angle, length)
    return {x1,y1,x2,y2}
  }

  lineEnd = (x1, y1, angle, length) => {
    angle = angle * Math.PI / 180
    const x2 = x1 + (length * Math.sin(angle))
    const y2 = y1 + (length * Math.cos(angle))
    return {x2, y2}
  }

  componentDidMount() {
    if (!this.node) {return}
    let lines = []
    this.setSize()

    const trunkAngle = rnd(175,185),
      trunkLength = rnd(this.outer.height*.75, this.outer.bottom*.9),
      trunkStart = {x:this.outer.width/2, y:this.outer.height},
      strokeWidth = this.outer.width/30

    lines.push({...this.getLine(trunkStart.x, trunkStart.y, trunkAngle, trunkLength), strokeWidth})

    const branches = this.outer.height/7
    const segment = trunkLength/branches
    
    for (let angle of [[80,120], [240,280]]) {
      for (let branch = 3; branch < branches-2; branch++) {
        const posOnTrunk = rnd(segment*branch, segment*(branch+1))
        const branchStart = this.lineEnd(trunkStart.x, trunkStart.y, trunkAngle, posOnTrunk)
        const branchAngle = rnd(angle[0], angle[1])
        const branchLength = (this.outer.width - branchStart.x2) * (1-(branch/branches))

        lines.push({...this.getLine(branchStart.x2, branchStart.y2, branchAngle, branchLength), strokeWidth:strokeWidth/2, strokeOpacity: 0.75})
        
        const subBranches = branchLength/1.5
        const subSegment = branchLength/subBranches
          for (let subBranch = 0; subBranch < subBranches-1; subBranch++) {
            const posOnBranch = rnd(subSegment*subBranch, subSegment*(subBranch+1))
            const subBranchStart = this.lineEnd(branchStart.x2, branchStart.y2, branchAngle, posOnBranch)
            const subBranchAngle = rnd(170,190)
            const subBranchLength = rnd(trunkLength/15, trunkLength/30)
    
            lines.push({...this.getLine(subBranchStart.x2, subBranchStart.y2+(subBranchLength/2), subBranchAngle, subBranchLength), strokeWidth:strokeWidth/4, stroke: 'darkgreen'})
        }
      }
    }

    this.setState({lines})
  }
  
  render = () => {
    return (
      <svg className="pine-tree" xmlns={SVGNS} viewBox={this.state.viewBox} ref={n=>this.node=n}>
        {
          this.state.lines.map((line, ndx) => {
            return (<line stroke="SaddleBrown" {...line} key={`line-${ndx}`} />)
          })
        }
      </svg>
    )
  }
}

class WinterScene extends React.Component {
  render() {
    return (
      <div>
        <Stars />
        <PineTree />
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