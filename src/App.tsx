import { useState } from "react";
import { Maze } from "./entities/maze"
import { bfs } from "./bfs";
import { aStar } from "./a_star";

function App() {

  const mazeSize = 20;
  const [time, setTime] = useState<number>(0);
  const [maze, setMaze] = useState<Maze | null>(null);

  const handleRegenerate = () => {
    const startTime = new Date().getTime();
    const tmp = new Maze(mazeSize, mazeSize);
    tmp.generate();

    setMaze(tmp);
    const endTime = new Date().getTime();
    setTime(endTime - startTime);
  }

  const handleBfs = () => {
    const bfsStartTime = new Date().getTime();

    const tmp = new Maze(mazeSize, mazeSize);
    if (maze) tmp.setCells(maze.getCells());

    const path = bfs(tmp.getStart(), tmp.getEnd(), tmp.getCells());
    const bfsEndTime = new Date().getTime();

    console.log('Time to generate BFS solution: ', bfsEndTime - bfsStartTime, 'ms');

    path.forEach(cell => {
      tmp.setCellPath(cell.x, cell.y, 'bfs');
    });

    setMaze(tmp);
  }

  const handleAStar = () => {
    const aStarStartTime = new Date().getTime();

    const tmp = new Maze(mazeSize, mazeSize);
    if (maze) tmp.setCells(maze.getCells());

    const path = aStar(tmp.getStart(), tmp.getEnd(), tmp);
    const aStarEndTime = new Date().getTime();

    console.log('Time to generate A* solution: ', aStarEndTime - aStarStartTime, 'ms');

    path.forEach(cell => {
      tmp.setCellPath(cell.x, cell.y, 'astar');
    });

    setMaze(tmp);
  }

  return (
    <>
      <h1>Maze Runner</h1>
      <button onClick={handleRegenerate} >Regenerate</button>
      <button onClick={() => handleBfs()} >Display BFS path</button>
      <button onClick={() => handleAStar()} >Display A* path</button>
      <p>Time to generate: {time}ms</p>
      <div className="maze">
        {maze && maze.getCells().map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div key={j} className={cell.getClass()}>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
