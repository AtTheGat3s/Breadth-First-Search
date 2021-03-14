import React, { useEffect , useState } from 'react'
import './BFS.css'

//TODO: cleanup addObstacles, add Obstacles

/**
 * https://www.redblobgames.com/grids/hexagons for hexagonal grid logic
 */

const DUMMY_OBSTACLES = ['{"q":4,"r":-2,"s":-2}', '{"q":4,"r":-1,"s":-3}', '{"q":4,"r":0,"s":-4}', '{"q":4,"r":1,"s":-5}', '{"q":3,"r":2,"s":-5}', '{"q":2,"r":3,"s":-5}', '{"q":1,"r":4,"s":-5}', '{"q":0,"r":5,"s":-5}', '{"q":-1,"r":6,"s":-5}', '{"q":-2,"r":7,"s":-5}', '{"q":4,"r":-4,"s":0}', '{"q":3,"r":-4,"s":1}', '{"q":2,"r":-4,"s":2}', '{"q":1,"r":-4,"s":3}', '{"q":2,"r":-5,"s":3}', '{"q":3,"r":-6,"s":3}', '{"q":4,"r":-7,"s":3}', '{"q":5,"r":-9,"s":4}', '{"q":6,"r":-9,"s":3}', '{"q":7,"r":-9,"s":2}', '{"q":8,"r":-9,"s":1}', '{"q":9,"r":-9,"s":0}', '{"q":10,"r":-9,"s":-1}', '{"q":11,"r":-9,"s":-2}', '{"q":12,"r":-9,"s":-3}', '{"q":13,"r":-9,"s":-4}', '{"q":14,"r":-9,"s":-5}', '{"q":15,"r":-9,"s":-6}', '{"q":15,"r":-8,"s":-7}', '{"q":14,"r":-7,"s":-7}', '{"q":14,"r":-6,"s":-8}', '{"q":13,"r":-5,"s":-8}', '{"q":13,"r":-4,"s":-9}', '{"q":12,"r":-3,"s":-9}', '{"q":12,"r":-2,"s":-10}', '{"q":11,"r":-1,"s":-10}', '{"q":11,"r":0,"s":-11}', '{"q":10,"r":1,"s":-11}', '{"q":10,"r":2,"s":-12}', '{"q":9,"r":3,"s":-12}', '{"q":9,"r":4,"s":-13}', '{"q":8,"r":5,"s":-13}', '{"q":8,"r":6,"s":-14}', '{"q":7,"r":7,"s":-14}', '{"q":7,"r":8,"s":-15}', '{"q":6,"r":9,"s":-15}', '{"q":5,"r":9,"s":-14}', '{"q":4,"r":9,"s":-13}', '{"q":3,"r":9,"s":-12}', '{"q":2,"r":9,"s":-11}', '{"q":1,"r":9,"s":-10}', '{"q":0,"r":9,"s":-9}', '{"q":-1,"r":9,"s":-8}', '{"q":-2,"r":9,"s":-7}', '{"q":-3,"r":9,"s":-6}', '{"q":-4,"r":9,"s":-5}', '{"q":-5,"r":9,"s":-4}', '{"q":-5,"r":8,"s":-3}', '{"q":-5,"r":7,"s":-2}', '{"q":-5,"r":6,"s":-1}', '{"q":-5,"r":5,"s":0}', '{"q":-4,"r":4,"s":0}', '{"q":-3,"r":3,"s":0}', '{"q":-2,"r":-1,"s":3}', '{"q":-2,"r":-2,"s":4}', '{"q":-4,"r":1,"s":3}', '{"q":-4,"r":2,"s":2}', '{"q":-5,"r":3,"s":2}', '{"q":-7,"r":4,"s":3}', '{"q":-6,"r":4,"s":2}', '{"q":-8,"r":4,"s":4}', '{"q":-9,"r":4,"s":5}', '{"q":-10,"r":4,"s":6}', '{"q":-11,"r":4,"s":7}', '{"q":-12,"r":4,"s":8}', '{"q":-12,"r":2,"s":10}', '{"q":-12,"r":3,"s":9}', '{"q":-13,"r":4,"s":9}', '{"q":-13,"r":5,"s":8}', '{"q":-14,"r":6,"s":8}', '{"q":-14,"r":7,"s":7}', '{"q":-15,"r":8,"s":7}', '{"q":-15,"r":9,"s":6}', '{"q":-14,"r":9,"s":5}', '{"q":-13,"r":9,"s":4}', '{"q":-12,"r":9,"s":3}', '{"q":-11,"r":9,"s":2}', '{"q":-10,"r":9,"s":1}', '{"q":-9,"r":9,"s":0}', '{"q":-8,"r":9,"s":-1}', '{"q":-7,"r":9,"s":-2}', '{"q":-6,"r":9,"s":-3}', '{"q":-11,"r":1,"s":10}', '{"q":-11,"r":0,"s":11}', '{"q":-10,"r":-1,"s":11}', '{"q":-10,"r":-2,"s":12}', '{"q":-9,"r":-3,"s":12}', '{"q":-9,"r":-4,"s":13}', '{"q":-8,"r":-5,"s":13}', '{"q":-8,"r":-6,"s":14}', '{"q":-7,"r":-7,"s":14}', '{"q":-7,"r":-8,"s":15}', '{"q":-6,"r":-9,"s":15}', '{"q":-5,"r":-9,"s":14}', '{"q":-4,"r":-9,"s":13}', '{"q":-3,"r":-9,"s":12}', '{"q":-2,"r":-9,"s":11}', '{"q":-1,"r":-9,"s":10}', '{"q":0,"r":-9,"s":9}', '{"q":1,"r":-9,"s":8}', '{"q":2,"r":-9,"s":7}', '{"q":3,"r":-9,"s":6}', '{"q":4,"r":-9,"s":5}', '{"q":-2,"r":-8,"s":10}', '{"q":-3,"r":-7,"s":10}', '{"q":-4,"r":-6,"s":10}', '{"q":-5,"r":-5,"s":10}', '{"q":-6,"r":-4,"s":10}', '{"q":-7,"r":-4,"s":11}', '{"q":-6,"r":-2,"s":8}', '{"q":-6,"r":-1,"s":7}', '{"q":-6,"r":0,"s":6}', '{"q":-6,"r":1,"s":5}', '{"q":7,"r":-2,"s":-5}', '{"q":8,"r":-2,"s":-6}', '{"q":9,"r":-3,"s":-6}', '{"q":10,"r":-3,"s":-7}', '{"q":4,"r":5,"s":-9}', '{"q":4,"r":6,"s":-10}', '{"q":5,"r":6,"s":-11}', '{"q":5,"r":7,"s":-12}']

const BFS = React.memo(function BFS(props) {
    const [canvasSize, setCanvasSize] = useState({canvasWidth: 800, canvasHeight: 600})
    const [hexSize, setHexSize] = useState(20)
    const [hexOrigin, setHexOrigin] = useState({ x: 400, y: 300})
    const [hexParametres, setHexParametres] = useState(getHexParametres())
    const [canvasPosition, setCanvasPosition] = useState()
    const [currentHex, setCurrentHex] = useState({ q: 0, r: 0, s: 0, x: 0, y: 0 })
    const [currentDistanceLine, setCurrentDistanceLine] = useState([])
    const [obstacles, setObstacles] = useState(DUMMY_OBSTACLES)
    const [playerPosition, setPlayerPosition] = useState({ q: 0, r: 0, s: 0 })
    const [cameFrom, setCameFrom] = useState({})
    const [hexPath, setHexPath] = useState([])
    const [path, setPath] = useState([])
    let canvasHex
    let canvasInteraction
    let canvasCoordinates
    let canvasView

    /**
     * On mounting the hexagons get drawn and properties of the canvas gets initialized, also the hexagon where the mouse is gets highlighted
     */

    useEffect(() => {
      const { canvasWidth, canvasHeight } = canvasSize
      canvasHex.width = canvasWidth
      canvasHex.height = canvasHeight
      canvasInteraction.width = canvasWidth
      canvasInteraction.height = canvasHeight
      canvasView.width = canvasWidth
      canvasView.height = canvasHeight
      getCanvasPosition(canvasInteraction)
      drawHex(canvasInteraction, point(playerPosition.x,
        playerPosition.y), 1, "black", "grey", 0.2);
      drawObstacles()
      drawHexes()
    }, [])

    useEffect(() => {     
        const { canvasWidth, canvasHeight } = canvasSize
        const { q, r, s, x, y} = currentHex
        const ctx = canvasInteraction.getContext("2d")
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        drawPath()
    }, [currentHex])

    useEffect(() => {
        const { canvasWidth, canvasHeight } = canvasSize
        const ctx = canvasView.getContext("2d")
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        for( let l in cameFrom) {
          const { q, r, s } = JSON.parse(l)
          const { x, y } = hexToPixel(hex(q, r))
          drawHex(canvasView, point(x, y), 1, "black", "grey", 0.1)
          const from = JSON.parse(cameFrom[l])
          const fromCoord = hexToPixel(hex(from.q, from.r))
          drawArrow(fromCoord.x, fromCoord.y, x, y)
        }
    }, [cameFrom])

    useEffect(() => {
      breadthFirstSearch(playerPosition)
    }, [hexPath])

    useEffect(() => {
      breadthFirstSearch(playerPosition)
    }, [playerPosition])


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
    
    function drawHex(canvasID, center, lineWidth, lineColour, fillColour) {
        for( let i = 0; i <= 5; i++) {
            let start = getHexCornerCoord(center, i)
            let end = getHexCornerCoord(center, i + 1)
            fillHex(canvasID, center, fillColour)
            drawLine(canvasID, start, end, lineWidth, lineColour)
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

    function drawLine(canvasID, start, end, lineWidth, lineColour) {
        const ctx = canvasID.getContext("2d")
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.strokeStyle = lineColour
        ctx.lineWidth = lineWidth
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
        let qLeftSide = Math.round(hexOrigin.x/horizDist);
        let qRightSide = Math.round((canvasWidth - hexOrigin.x)/horizDist);
        let rTopSide = Math.round(hexOrigin.y/vertDist);
        let rBottomSide = Math.round((canvasHeight - hexOrigin.y)/vertDist);
        let hexPathMap = []
        let p = 0
        for(let r = 0; r <= rBottomSide; r++) {
          if(r % 2 === 0 && r !== 0) {
            p++
          }
          for(let q = -qLeftSide; q <= qRightSide; q++) {
            const { x, y } = hexToPixel(hex(q-p, r))
            if((x > hexWidth/2 && x < canvasWidth - hexWidth/2) && (y > hexHeight/2 && y < canvasHeight - hexHeight/2)) {
              drawHex(canvasHex, point(x,y), 1, "black",  "grey")
              //drawHexCoordinates(canvasHex, point(x,y), hex(q-p, r, - (q - p) - r))
              let bottomH = JSON.stringify(hex(q - p, r, - (q - p) - r))
              if(!obstacles.includes(bottomH)){
                hexPathMap.push(bottomH)
              }
            }
          }
        }
        let n = 0;
        for(let r = -1; r >= -rTopSide; r--) {
           if(r%2 !== 0) {
             n++
           }
           for(let q = -qLeftSide; q <= qRightSide; q++) {
             const { x, y } = hexToPixel(hex(q+n, r))
              if((x > hexWidth/2 && x < canvasWidth - hexWidth/2) && (y > hexHeight/2 && y < canvasHeight - hexHeight/2)) {
                drawHex(canvasHex, point(x,y), 1, "black",  "grey")
                //drawHexCoordinates(canvasHex, point(x,y), hex(q+n, r, - (q + n) - r))
                let topH = JSON.stringify(hex(q + n, r, - (q + n) - r))
                if(!obstacles.includes(topH)){
                  hexPathMap.push(topH)
                }
             }
           }
        }
      hexPathMap = [].concat(hexPathMap)
      setHexPath(hexPathMap)
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
        const { canvasWidth, canvasHeight } = canvasSize
        const { hexWidth, hexHeight, vertDist, horizDist } = hexParametres
        const offsetX = e.pageX - left
        const offsetY = e.pageY - top
        const { q, r, s } = cubeRound(pixelToHex(point(offsetX, offsetY)))
        const { x, y } = hexToPixel(hex(q, r, s))
        getDistanceLine(hex(0, 0, 0), hex(q, r, s))
        getPath( hex(playerPosition.q, playerPosition.r, playerPosition.s), hex(q, r, s))
        if((x > hexWidth / 2 && x < canvasWidth - hexWidth / 2) && (y > hexHeight / 2 && y < canvasHeight - hexHeight/2)) {
          setCurrentHex({ q, r, s, x, y})
        }
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
        return hex(q, r, - q - r)
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
        return hex(rx, ry, rz)
    }

    /**
     * Returns one of the six neighbours of a hexagon, which will be found through vector addition
     * @param {number} direction - number between zero and five each representing one neighbour of the hexagon 
     * @returns - One neighbour of a hexagon 
     */

    function cubeDirections(direction) {
      const cubeDirections = [hex(1, 0, -1), hex(1, -1, 0), hex(0, -1, 1), hex(-1, 0, 1), hex(-1, 1, 0),
      hex(0, 1, -1)]
      return cubeDirections[direction]
    }
    
    /**
     * Vector addition of our threedimensional hexagon coordinates
     * @param {Object} a - first hexagon
     * @param {Object} b - second hexagon
     * @returns - Vector sum of both hexagons
     */

    function cubeAdd(a, b) {
      return hex(a.q + b.q, a.r + b.r, a.s + b.s)
    }

    /**
     * Vector subtraction of our threedimensional hexagon coordinates
     * @param {Object} a - first hexagon
     * @param {Object} b - second hexagon
     * @returns - Vector difference of both hexagons
     */


    function cubeSubstract(a, b) {
      return hex(a.q - b.q, a.r - b.r, a.s - b.s)
    }

    /**
     * @param {Object} h - a hexagon 
     * @param {number} direction - number between zero and five each representing one neighbour of the hexagon 
     * @returns - the hexagon neighbour
     */
    
    function getCubeNeighbour(h, direction) {
      return cubeAdd(h, cubeDirections(direction))
    }


    /**
     * Calculates the distance of two hexagons
     * @param {Object} a - first hexagon 
     * @param {Object} b - second hexagon
     * @returns distance between the two hexagons
     */

    function cubeDistance(a, b) {
      const { q, r, s } = cubeSubstract(a, b)
      return (Math.abs(q) + Math.abs(r) + Math.abs(s)) /2
    }

    /**
     * one dimensional linear interpolation
     * @param {number} a - first one dimensional point
     * @param {number} b - second one dimensional point
     * @param {number} t - linear interpolation function parameter between 0 and 1: calculates distance between the two points, 0 resulting in @param a and 1 resulting in @param b
     * @returns a point on the linear interpolation function
     */

    function linearInt(a, b, t) {
      return (a + (b - a) * t)
    }

    /**
     * three dimensional linear interpolation
     * @param {Object} a - first hexagon 
     * @param {Object} b - second hexagon
     * @param {number} t - linear interpolation function parameter between 0 and 1: calculates distance between the two points, 0 resulting in @param a and 1 resulting in @param b
     * @returns 
     */
    
    function cubeLinearInt(a, b, t) {
      return hex(linearInt(a.q, b.q, t), linearInt(a.r, b.r, t), linearInt(a.s, b.s, t))
    }

    /**
     * Collects all hexagons in a distance line between two hexagons in an array
     * @param {Object} a - first hexagon
     * @param {Object} b - second hexagon
     */

    function getDistanceLine(a, b) {
      let dist = cubeDistance(a, b)
      let arr = []
      for(let i = 0; i <= dist; i++) {
        let center = hexToPixel(cubeRound(cubeLinearInt(a, b, 1.0 / dist * i)))
        arr = [].concat(arr, center)
      }
      setCurrentDistanceLine(arr)
    }

    /**
     * fills a hexagon with colour by connecting each corner of a hexagon and fill the space in between
     * @param {Object} canvasID - the canvas object
     * @param {*} center - two dimensional center coordinate of a hexagon
     * @param {*} fillColor - colour that the hexagon gets filled with
     */

    function fillHex(canvasID, center, fillColour) {
      let c0 = getHexCornerCoord(center, 0);
      let c1 = getHexCornerCoord(center, 1);
      let c2 = getHexCornerCoord(center, 2);
      let c3 = getHexCornerCoord(center, 3);
      let c4 = getHexCornerCoord(center, 4);
      let c5 = getHexCornerCoord(center, 5);
      const ctx = canvasID.getContext("2d");
      ctx.beginPath();
      ctx.fillStyle = fillColour;
      ctx.globalAlpha = 0.1;
      ctx.moveTo(c0.x, c0.y);
      ctx.lineTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.lineTo(c3.x, c3.y);
      ctx.lineTo(c4.x, c4.y);
      ctx.lineTo(c5.x, c5.y);
      ctx.closePath();
      ctx.fill();
    }

    function handleClick() {
      const { q, r, s } = currentHex
      if( cameFrom[JSON.stringify(hex(q, r, s))]){
        setPlayerPosition(hex(q, r, s))
      }
    }

    function drawObstacles(){
      obstacles.map((l) => {
        const { q, r, s } = JSON.parse(l)
        const { x, y } = hexToPixel(hex(q, r, s))
        drawHex(canvasHex, point(x, y), 1, "black", "black")
      })
    }

    /**
     * Creates an array with all six neighbours of a hexagon
     * @param {Object} h - a hexagon
     * @returns - Array with all neighbours of a hexagon
     */
    
     function getNeighbours(h) {
      let arr = []
      for( let i = 0; i <= 5; i++ ) {
        const { q, r, s } = getCubeNeighbour(hex(h.q, h.r, h.s), i)
        arr.push(hex(q, r, s))
      }
      return arr
    }

    function breadthFirstSearch(currentPlayerPosition) {
      let frontier = [currentPlayerPosition]
      let cameFromHex = {}
      cameFromHex[JSON.stringify(currentPlayerPosition)] = JSON.stringify(currentPlayerPosition)
      while (frontier.length !== 0) {
        let current = frontier.shift()
        let arr = getNeighbours(current)
        
        arr.map((l) => {
          if((!cameFromHex.hasOwnProperty(JSON.stringify(l))) && hexPath.includes(JSON.stringify(l))) {
            frontier.push(l)
            cameFromHex[JSON.stringify(l)] = JSON.stringify(current)
          }
        })
      }
      cameFromHex = Object.assign({}, cameFromHex)
      setCameFrom(cameFromHex)
    }

    function getPath(start, current) {
      start = JSON.stringify(start)
      current = JSON.stringify(current)
      if(cameFrom[current] !== undefined) {
        let currentPath = [current]
        while ( current !== start ){
          current = cameFrom[current]
          currentPath.push(current)
        }
        currentPath = [].concat(currentPath)
        setPath(currentPath)
      }
    }

    function drawPath() {
      for( let i = 0; i <= path.length - 1; i++ ){
        const { q, r } = JSON.parse(path[i])
        const { x, y } = hexToPixel(hex(q, r))
        drawHex(canvasInteraction, point(x, y), 1, "black", "#05b9f5")
      }
    }

    function drawArrow(fromx, fromy, tox, toy) {
      var ctx = canvasView.getContext("2d");
      var headlen = 5;
      var angle = Math.atan2(toy-fromy,tox-fromx);
      ctx.beginPath();
      ctx.moveTo(fromx, fromy);
      ctx.lineTo(tox, toy);
      ctx.strokeStyle = "#05b9f5";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tox, toy);
      ctx.globalAlpha = 0.3;
      ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
      ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
      ctx.lineTo(tox, toy);
      ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
      ctx.strokeStyle = "#05b9f5";
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.fillStyle = "#05b9f5";
      ctx.fill();
  }
  

    return(
        <div className="BFS">
            <canvas ref={ cHex => canvasHex = cHex}></canvas>
            <canvas ref={ cHex => canvasCoordinates = cHex}></canvas>
            <canvas ref={ cHex => canvasView = cHex}></canvas>
            <canvas 
              ref={ cHex => canvasInteraction = cHex} 
              onMouseMove = {handleMouseMove}
              onClick = {handleClick}>
            </canvas>
        </div>
    )
});

export default BFS