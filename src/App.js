import BFS from "./BFS/BFS"
import Navbar from "./Navbar/Navbar"
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <p>
        Click different ares of the board to see how the Breadth-first search finds the shortest path! The shortest path is being calculated
        by giving a distance value to every node on the board. The arrows indicate the path that the algorithm is taking from node to node.
      </p>
      <BFS></BFS>
    </div>
  );
}

export default App;
