import React from 'react'
import {rnd, SVGNS} from './globals'

export class PineTrees extends React.Component {
  state = {trees:[]}

  componentDidMount = () => {
    const maxTreeH = 250
    const minTreeH = 100

    const treeCount = window.innerWidth / 100
    const segment = window.innerWidth / treeCount
    const minBottom = window.innerHeight * (2/3)
    const maxBottom = window.innerHeight

    let trees = []
    for (let tree=0; tree<(treeCount+1); tree++) {
      const size = rnd(minTreeH,maxTreeH)
      const left = rnd(segment*(tree-1), segment*tree)
      const ratio = (size-minTreeH) / (maxTreeH-minTreeH)
      const bottom = minBottom + (ratio * (maxBottom-minBottom))
      const top = bottom-size
      trees.push({left, top, size})
    }
    this.setState({trees})
  }

  render = () =>
    <div className="pine-trees">
      {this.state.trees.map((tree, ndx) => (
        <PineTree {...tree} key={`tree-${ndx}`} />
      ))}
    </div>
}

export class MobileTree extends React.Component {
  state = {trees:[]}

  componentDidMount = () => {
    let trees = []
    const h = window.innerHeight
    const w = window.innerWidth
    const snow = h * (2/3)

    const size = 350
    const treeWidth = (size / 250) * 200
    const left = (w/2) - (treeWidth/2)
    const top = snow + ((h-snow)/2) - size

    trees.push({
      left, top,
      size
    })
    this.setState({trees})
  }

  render = () => 
    <div className="pine-trees">
      {this.state.trees.map((tree, ndx) => (
        <PineTree {...tree} key={`tree-${ndx}`} />
      ))}
    </div>
}
  
  class PineTree extends React.Component {
    state = {lines:[], polylines:[], snowLines:[]}
  
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
  
    componentDidMount = () => {
      if (!this.node) {return}
      this.setSize()
      let lines = [], polylines = [], snowLines = []
      
      const trunkAngle = rnd(175,185)
      const trunkLength = this.outer.height
      const trunkStart = {x:this.outer.width/2, y:this.outer.height}
  
      lines.push({...this.getLine(trunkStart.x, trunkStart.y, trunkAngle, trunkLength), className: 'pine-trunk'})
  
      const branches = this.outer.height/5
      const segment = trunkLength/branches
  
      for (let angle of [[100,120], [240,260]]) {
        for (let branch = 3; branch < branches; branch++) {
          const posOnTrunk = rnd(segment*branch, segment*(branch+1))
          const branchStart = this.lineEnd(trunkStart.x, trunkStart.y, trunkAngle, posOnTrunk)
          const branchAngle = rnd(angle[0], angle[1])
          const branchLength = (this.outer.width - branchStart.x2) * (1-(branch/branches))
  
          const subBranches = branchLength/3
          const subSegment = branchLength/subBranches
          let polyline = ""
          for (let subBranch = 0; subBranch < subBranches-1; subBranch++) {
            const posOnBranch = rnd(subSegment*subBranch, subSegment*(subBranch+1))
            const subBranchStart = this.lineEnd(branchStart.x2, branchStart.y2, branchAngle, posOnBranch)
            const subBranchAngle = rnd(170,190)
            const subBranchLength = this.outer.height / 20
            const polySeg = {...this.getLine(subBranchStart.x2, subBranchStart.y2+(subBranchLength/2), subBranchAngle, subBranchLength)}
            polyline += `${polySeg.x1},${polySeg.y1} ${polySeg.x2},${polySeg.y2} `
            if (rnd(0,9)%3===0) {
              snowLines.push(polySeg)
            }
          }
          polylines.push(polyline)
        }
      }
  
      this.setState({lines,polylines,snowLines})
    }
    
    render = () => {
      const style = {
        top: this.props.top, 
        left: this.props.left,
        width:`${(this.props.size * 200) / 250}px`, 
        height: `${this.props.size}px`
      }
      
      return (
        <svg className="pine-tree" style={style} xmlns={SVGNS} viewBox={this.state.viewBox} ref={n=>this.node=n}>
          {
            this.state.lines.map((line, ndx) => (
              <line className="pine-branch" {...line} key={`line-${ndx}`} />
            ))
          }{
            this.state.polylines.map((polyline, ndx) => (
              <polyline className="pine-needle" points={polyline}  key={`polyline-${ndx}`} />
            ))
          }{
            this.state.snowLines.map((line, ndx) => (
              <line className="snow-needle" {...line} key={`snowline-${ndx}`} />
            ))
          }
        </svg>
      )
    }
  }