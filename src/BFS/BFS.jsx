import React, { useEffect , useState } from 'react'
import './BFS.css'

function BFS(props) {
    const [canvasSize, setCanvasSize] = useState({canvasWidth: 800, canvasHeight: 600})
    const [hexSize, setHexSize] = useState(20)
    const [hexOrigin, setHexOrigin] = useState({ x: 400, y: 300})
    const [hexParametres, setHexParametres] = useState(getHexParametres())
    const [canvasPosition, setCanvasPosition] = useState()
    const [currentHex, setCurrentHex] = useState()
    let canvasHex
    let canvasCoordinates

    /**
     * On mounting the hexagons get drawn
     */

    useEffect(() => {
        const { canvasWidth, canvasHeight } = canvasSize
        canvasHex.width = canvasWidth
        canvasHex.height = canvasHeight
        canvasCoordinates.width = canvasWidth
        canvasCoordinates.height = canvasHeight
        getCanvasPosition(canvasCoordinates)
        drawHexes()
    })

    /**
     * Calculate the coordinate for i-th corner of a hexagon given its center coordinate
     * 
     * @param {Object} center - hex center coordinates
     * @param {number} i - i-th corner of the hexagon
     * @returns {Object} - coordinate of the i-th i-th corner of a hexagon given its center coordinate
     */

    function getHexCornerCoord(center, i){
        let angle_deg = 60 * i + 30
        let angle_rad = Math.PI / 180 * angle_deg
        let x = center.x + hexSize * Math.cos(angle_rad)
        let y = center.y + hexSize * Math.sin(angle_rad)
        return point(x, y)
    }

    /**
     * Creates a two dimensional point
     * @param {number} x 
     * @param {number} y 
     * @returns {Object} two dimensional point
     */

    function point(x, y) {
        return {x: x, y: y}
    }

    /**
     * Creates an ID for the hexagon by projecting a plane through a cube on our canvas, this makes implementing other functions easier
     * @param {number} q - column
     * @param {number} r - row
     * @param {number} s - third unused axis 
     * @returns {Object} column and row of a hexagon
     * 
     * @see https://www.redblobgames.com/grids/hexagons/#coordinates
     */

    function hex(q, r, s) {
        return { q: q, r: r, s: s}
    }

    /**
     * Draws a hexagon
     * @param {Object} canvasID - the canvas object
     * @param {Object} center - center coordinate of the hexagon
     * @param {string} color - Color of the line drawn around the current hexagon
     * @param {number} width - Width of the line drawn around the current hexagon
     */
    
    function drawHex(canvasID, center, color, width) {
        for( let i = 0; i <= 5; i++) {
            let start = getHexCornerCoord(center, i)
            let end = getHexCornerCoord(center, i + 1)

            drawLine(canvasID, { x: start.x, y: start.y }, { x: end.x, y:end.y }, color, width)
        }
    }

    /**
     * Draws a line between two points
     * @param {Object} canvasID - the canvas object
     * @param {Object} start - Starting coordinate of the line
     * @param {Object} end - Ending coordinate of the line
     * @param {string} color - Color of the line drawn around the current hexagon
     * @param {number} width - Width of the line drawn around the current hexagon
     */

    function drawLine(canvasID, start, end, color, width) {
        const ctx = canvasID.getContext("2d")
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
        ctx.closePath()
    }

    /**
     * Draws all hexagons in our canvas
     */

    function drawHexes() {
        const { canvasWidth, canvasHeight } = canvasSize
        const { hexWidth, hexHeight, vertDist, horizDist} = getHexParametres()
        const qLeftSide = Math.round(hexOrigin.x/hexWidth) * 4
        const qRightSide = Math.round(canvasWidth - hexOrigin.x) / hexWidth * 2
        const rTopSide = Math.round(hexOrigin.y/(hexHeight/2))
        const rBottomSide = Math.round((canvasHeight - hexOrigin.y)/(hexHeight/2))
        
        var p = 0
        for(let r = 0; r <= rBottomSide; r++) {
          if(r % 2 === 0 && r !== 0) {
            p++
          }
          for(let q = -qLeftSide; q <= qRightSide; q++) {
            const { x, y } = hexToPixel(hex(q-p, r))
            if((x > hexWidth/2 && x < canvasWidth - hexWidth/2) && (y > hexHeight/2 && y < canvasHeight - hexHeight/2)) {
              drawHex(canvasHex, point(x,y))
              drawHexCoordinates(canvasHex, point(x,y), hex(q-p, r, - q - r))
            }
          }
        }
        var n = 0;
        for(let r = -1; r >= -rTopSide; r--) {
           if(r%2 !== 0) {
             n++
           }
           for(let q = -qLeftSide; q <= qRightSide; q++) {
             const { x, y } = hexToPixel(hex(q+n, r))
             if((x > hexWidth/2 && x < canvasWidth - hexWidth/2) && (y > hexHeight/2 && y < canvasHeight - hexHeight/2)) {
               drawHex(canvasHex, point(x,y))
               drawHexCoordinates(canvasHex, point(x,y), hex(q+n, r, - q - r))
             }
           }
        }
    }

    /**
     * Calculates the center coordinate of each hexagon
     * @param {Object} h - Hexagon ID  
     * @returns {Object} Coordinate of the hexagon center
     */

    function hexToPixel(h){
        const x = hexSize * Math.sqrt(3) * (h.q + h.r/2) + hexOrigin.x
        const y = hexSize * 3/2 * h.r + hexOrigin.y
        return point(x, y)
    }

    /**
     * Gives visual feedback of row and column of each hexagon
     * @param {Object} canvasID - the canvas object
     * @param {Object} center - center coordinate of the hexagon
     * @param {Object} h - provides column and row a hexagon
     */

    function drawHexCoordinates(canvasID, center, h) {
        const ctx = canvasID.getContext("2d")
        ctx.fillText(h.q, center.x + 6, center.y)
        ctx.fillText(h.r, center.x - 3, center.y + 15)
        ctx.fillText(h.s, center.x - 12, center.y)
    }

    /**
     * Calculates heigth and width of hexagon and the distance between each hexagon vertically and horizontally
     * @returns {Object} hexagon width, hexagon height, vertical distance between two hexagons, horizontal distance between two hexagons
     */

    function getHexParametres(){
        const hexHeight = hexSize * 2
        const hexWidth = Math.sqrt(3)/2 * hexHeight
        const vertDist = hexHeight * 3/4
        const horizDist = hexWidth
        return { hexWidth, hexHeight, vertDist, horizDist}
    }

    /**
     * 
     * @param {*} e 
     */

    function handleMouseMove(e) {
        const { left, right, top, bottom } = canvasPosition
        console.log(e.pageX, e.pageY)
        const offsetX = e.pageX - left
        const offsetY = e.pageY - top
        const { q, r, s } = cubeRound(pixelToHex(point(offsetX, offsetY)))
        const { x, y } = hexToPixel(hex(q, r, s))
        drawHex(canvasCoordinates, point(x, y), "green", 2)
        setCurrentHex({ q, r, s, x, y})
    }

    /**
     * Adjust our mouse position to whereever we place our canvas on the page, so that the top left of our canvas represents the origin of our canvas coordinates
     * @param {Object} canvasID - the canvas object
     */

    function getCanvasPosition(canvasID) {
        const rect = canvasID.getBoundingClientRect()
        setCanvasPosition({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom})
    }

    /**
     * Assigns a hexagon to each pixel
     * @param {Object} p - pixel coordinates 
     * @returns {Object} - hexagon on the pixel coordinate
     */

    function pixelToHex(p) {
        const q = ((p.x - hexOrigin.x) * Math.sqrt(3)/3 - (p.y - hexOrigin.y) / 3) / hexSize
        const r = (p.y - hexOrigin.y) * 2/3 / hexSize
        return hex(q, r, - q - r);
    }

    /**
     * converts floating cube coordinates to integer values
     * @param {Object} cube - hexagon with floating cube coordinates
     * @returns {Object} - hexagon with integer cube coordinates
     */

    function cubeRound(cube) {
        let rx = Math.round(cube.q)
        let ry = Math.round(cube.r)
        let rz = Math.round(cube.s)
      
        const x_diff = Math.abs(rx - cube.q)
        const y_diff = Math.abs(ry - cube.r)
        const z_diff = Math.abs(rz - cube.s)
      
        if(x_diff > y_diff && x_diff > z_diff) {
          rx = -ry-rz
        }
        else if(y_diff > z_diff) {
          ry = -rx-rz
        }
        else{
          rz = -rx-ry
        }
        return hex(rx, ry, rz);
    }

    return(
        <div className="BFS">
            <canvas ref={ cHex => canvasHex = cHex}></canvas>
            <canvas ref={ cCoordinates => canvasCoordinates = cCoordinates} onMouseMove = {handleMouseMove}></canvas>
        </div>
    )
}

export default BFS