import { isReachable } from "./bfs";
import { Cell } from "./entities/cell";
import { Maze } from "./entities/maze";


export function aStar(start: Cell, end: Cell, maze: Maze): Cell[] {
    const path: Cell[] = [];

    start.cost = calculateCost(start);
    start.heuristic = heuristic(start, end);

    const closedSet: Cell[] = [];
    const openSet: Cell[] = [start];
    let currentCell: Cell = new Cell('empty', -1, -1);

    while (openSet.length > 0) {

        currentCell = findMinimunCost(openSet);

        if (currentCell.type === 'end') break;

        openSet.splice(openSet.indexOf(currentCell));
        closedSet.push(currentCell);

        maze.findNeighbour(currentCell, true).forEach(neighbour => {

            if (isReachable(currentCell, neighbour)) {

                //si pas encore dans closedSet
                if (closedSet.indexOf(neighbour) === -1) {

                    const newCost = currentCell.cost + 1;

                    // si pas encore dans openset ou cout + intéressant
                    if (openSet.indexOf(neighbour) === -1 || newCost < neighbour.cost) {
                        neighbour.cost = newCost;
                        neighbour.heuristic = heuristic(neighbour, end);
                        neighbour.parent = currentCell;

                        if (openSet.indexOf(neighbour) === -1) {
                            openSet.push(neighbour);
                        }
                    }
                }
            }

        });
    }

    let tmpPathCell = end;

    while (tmpPathCell.type !== 'start') {
        path.push(tmpPathCell);
        if (tmpPathCell.parent) {
            tmpPathCell = tmpPathCell.parent;
        }
    }

    return path;
}

function findMinimunCost(cells: Cell[]): Cell {

    let minimumCell = cells[0];

    cells.forEach(cell => {
        if (minimumCell.getTotalCost() >= cell.getTotalCost()) {
            minimumCell = cell;
        }
    });

    return minimumCell;

}


// Distance de Manhattan
function heuristic(cell: Cell, end: Cell): number {
    return Math.abs(cell.x - end.x) + Math.abs(cell.y - end.y);
}

function calculateCost(cell: Cell): number {

    if (cell.type === 'start') return 0;

    let cost = 0;
    let currentCell = cell;

    while (currentCell.type !== 'start') {

        if (currentCell.parent) {
            cost += 1;
            currentCell = currentCell.parent;
        }
    }
    return cost;
}