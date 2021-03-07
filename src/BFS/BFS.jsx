import React, { useEffect , useState } from 'react'
import './BFS.css'

function BFS(props) {    
    const [canvasSize, setCanvasSize] = useState({canvasWidth: 800, canvasHeight: 600})
    const [hexSize, setHexSize] = useState(20)
    const canvasHex = {}

    useEffect(() => {
        const { canvasWidth, canvasHeight } = canvasSize
        canvasHex.width = canvasWidth
        canvasHex.height = canvasHeight
        drawHex(canvasHex, {x: 50, y: 50})
    })

    function getHexCornerCoord(center, i){
        let angle_deg = 60 * i + 30
        let angle_rad = Math.PI / 180 * angle_deg
        let x = center.x + hexSize * Math.cos(angle_rad)
        let y = center.y + hexSize * Math.sin(angle_rad)
        return point(x, y)
    }

    function point(x, y) {
        return {x: x, y: y}
    }
    
    function drawHex(canvasID, center) {
        for( let i = 0; i <= 5; i++) {
            let start = getHexCornerCoord(center, i)
            let end = getHexCornerCoord(center, i + 1)

            drawLine(canvasID, { x: start.x, y: start.y }, { x: end.x, y:end.y })
        }
    }

    function drawLine(canvasID, start, end) {
        const ctx = canvasID.getContext("2d")
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
        ctx.closePath()
    }

    return(
        <div className="BFS">
            <canvas></canvas>
        </div>
    )
}

export default BFS