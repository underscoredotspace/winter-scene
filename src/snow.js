import React from 'react'
import {rnd} from './globals'


class SnowParticle {
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

    draw = () => {
        this.ctx.beginPath()
        this.ctx.arc(this.pos.x,this.pos.y,this.size,0,2*Math.PI)
        this.ctx.fill()
    }

    update = () => {
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
  
export default class Snow extends React.Component {
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

    animate = () => {
        requestAnimationFrame(() => {
        this.animate()

        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
        for(let particle of this.particles) {
            this.ctx.fillStyle=`rgba(220,220,255,${(particle.size/9)})`
            particle.update()
            particle.draw()
        }
        })
    }

    componentDidMount = () => {
        if (!this.hasOwnProperty('canvas')) return
        this.ctx = this.canvas.getContext('2d')

        window.addEventListener("resize", this.updateCanvasSize)
        this.updateCanvasSize()

        this.particles = []

        const particleCount = (window.innerWidth*window.innerHeight) / 3000
        for (let particle=0; particle<particleCount; particle++) {
        const dropSpeed = rnd(500,3000)/1000
        const wibbleAmount = rnd(100,1000)/10
        const wibbleSpeed = rnd(100,200)/1000
        const size = rnd(10,60)/10
        const pos = {y:rnd(0, this.canvas.height),x:rnd(-1, this.canvas.width+1)}
        this.particles.push(
            new SnowParticle(this.ctx, pos, size, {x:wibbleSpeed,y:dropSpeed}, wibbleAmount)
        )
        }

        this.animate()
    }

    render = () => (
        <canvas id="snow" ref={n=>(this.canvas=n)}></canvas>
    )
}