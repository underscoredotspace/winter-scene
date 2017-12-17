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

class Stars extends React.Component {
  state = {stars: []}
  
  makeStars = () => {
    this.starFieldElement = document.querySelector('.star-field')

    const width = this.starFieldElement.clientWidth,
      height = this.starFieldElement.clientHeight,
      starDensity = height * width / 10000
    let stars = []

    for (let ndx = 0; ndx < starDensity; ndx++) {
      const { y, size, cycleTime, rotation } = {
        y: rnd(-10, height),
        size: rnd(3, 15),
        cycleTime: rnd(10, 25),
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

class Particle {
  constructor(ctx, pos, size=1, vel={x:1,y:0.5}, wibble=5) {
    if (!ctx) throw (new Error('Missing context'))
    if (!pos) throw (new Error('Missing position'))
    this.size = size
    this.pos = pos
    this.vel = vel
    this.ctx = ctx
    this.wibble = wibble
    this.startX = pos.x
    this.maxY = rnd(window.innerHeight*(2/3), window.innerHeight)
  }
  
  draw() {
    this.ctx.beginPath()
    this.ctx.arc(this.pos.x,this.pos.y,this.size,0,2*Math.PI)
    this.ctx.fill()
  }

  update() {
    // return to top of screen after dropping off bottom
    if(this.pos.y >= this.maxY) {
      this.pos.y = 0-(this.size*2)
      return
    }
    
    // Control wibble
    if ((this.pos.x > (this.startX+this.wibble)) || (this.pos.x < this.startX)) {
      this.vel.x = 0-this.vel.x
    }
    
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }
}

class Snow extends React.Component {
  updateCanvasSize = () => {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    if (!this.particles) return
    
    for(let particle of this.particles) {
      particle.pos.x = rnd(0-particle.size, this.canvas.width+particle.size)
      particle.startX = particle.pos.x
      particle.maxY = rnd(this.canvas.height*(2/3), this.canvas.height)
    }
  }

  animate(fps) {
    requestAnimationFrame(() => {
      this.animate(fps)
      const now = window.performance.now()
      if ((now - this.lastFrame) < (1000/fps)) return
      
      this.ctx.fillStyle='rgba(220,220,255,0.8)'
      this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
      for(let particle of this.particles) {
        particle.update()
        particle.draw()
      }
      this.lastFrame = now
    })
  }

  componentDidMount() {
    this.canvas = document.getElementById('snow')
    this.ctx = this.canvas.getContext('2d')
    this.fps = 30

    window.addEventListener("resize", this.updateCanvasSize)
    this.updateCanvasSize()

    this.particles = []

    const particleCount = (window.innerWidth*window.innerHeight) / 10000
    for (let particle=0; particle<particleCount; particle++) {
      const dropSpeed = rnd(1000,3000)/1000
      const wibbleAmount = rnd(100,300)/10
      const wibbleSpeed = rnd(200,300)/1000
      const size = rnd(20,40)/10
      const pos = {y:rnd(0, this.canvas.height),x:rnd(-1, this.canvas.width+1)}
      this.particles.push(
        new Particle(this.ctx, pos, size, {x:wibbleSpeed,y:dropSpeed}, wibbleAmount)
      )
    }

    this.lastFrame = window.performance.now()
    this.animate(this.fps)
  }

  render() {
    return (
      <div>
        <canvas id="snow"></canvas>
      </div>
    )
  }
}

ReactDOM.render(
  <WinterScene />, document.getElementById('root')
)

/*
class PineTrees extends React.Component  {
  state = {trees:[]}

  componentDidMount() {
    let trees = []
    this.outer = this.node.getBoundingClientRect()
    const treeCount = 10
    const treeWidth = this.outer.width / treeCount
    const segment = this.outer.width / treeCount
    const baseHeight = this.outer.height/4

    for (let tree = 0; tree < treeCount-1; tree++) {
      const left = rnd(segment*tree, segment*(tree+1))
      const bottom = rnd(((this.outer.height/3)*2)+20, this.outer.height-20)
      const height = baseHeight * (bottom/this.outer.height)
      const width = treeWidth * (bottom/this.outer.height)
      const top = bottom - height

      trees.push({left,top,height,width})
    }

    this.setState({trees})
  }

  render() {
    return (
      <div className="pine-trees" ref={n=>(this.node=n)}>
      {
        this.state.trees.map((tree, ndx) => 
          <PineTree {...tree} key={`tree-${ndx}`} />
        )
      }
      </div>
    )
  }
}

class PineTree extends React.Component {
  state = {lines:[], treeStyle: {
    width: `${this.props.width}px`,
    height: `${this.props.height}px`,
    left: `${this.props.left}px`,
    top: `${this.props.top}px`
  }}

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
      trunkLength = this.outer.height, //rnd(this.outer.height*.75, this.outer.height*.9),
      trunkStart = {x:this.outer.width/2, y:this.outer.height},
      strokeWidth = this.outer.width/30

    lines.push({...this.getLine(trunkStart.x, trunkStart.y, trunkAngle, trunkLength), strokeWidth})

    const branches = this.outer.height/5
    const segment = trunkLength/branches
    
    for (let angle of [[85,95], [265,275]]) {
      for (let branch = 3; branch < branches-2; branch++) {
        const posOnTrunk = rnd(segment*branch, segment*(branch+1))
        const branchStart = this.lineEnd(trunkStart.x, trunkStart.y, trunkAngle, posOnTrunk)
        const branchAngle = rnd(angle[0], angle[1])
        const branchLength = (this.outer.width - branchStart.x2) * (1-(branch/branches))

        lines.push({...this.getLine(branchStart.x2, branchStart.y2, branchAngle, branchLength), strokeWidth:strokeWidth/4, stroke: 'saddlebrown'})
        
        const subBranches = branchLength/1.5
        const subSegment = branchLength/subBranches
          for (let subBranch = 0; subBranch < subBranches-1; subBranch++) {
            const posOnBranch = rnd(subSegment*subBranch, subSegment*(subBranch+1))
            const subBranchStart = this.lineEnd(branchStart.x2, branchStart.y2, branchAngle, posOnBranch)
            const subBranchAngle = rnd(170,190)
            const subBranchLength = rnd(trunkLength/10, trunkLength/15)
    
            lines.push({...this.getLine(subBranchStart.x2, subBranchStart.y2+(subBranchLength/2), subBranchAngle, subBranchLength), strokeWidth:strokeWidth/5, stroke: '#003200'})
        }
      }
    }

    this.setState({lines})
  }
  
  render = () => {
    return (
      <svg className="pine-tree" xmlns={SVGNS} style={this.state.treeStyle} viewBox={this.state.viewBox} ref={n=>this.node=n}>
        {
          this.state.lines.map((line, ndx) => {
            return (<line stroke="#505000" {...line} key={`line-${ndx}`} />)
          })
        }
      </svg>
    )
  }
}
*/