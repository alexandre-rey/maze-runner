import { Cell } from "./entities/cell";

// Breadth First Search
export function bfs(start: Cell, end: Cell, maze: Cell[][]): Cell[] {

    const rows = maze.length;
    const cols = maze[0].length;
    const visited = new Set<string>();
    const queue: { cell: Cell, path: Cell[] }[] = [{ cell: start, path: [start] }];

    while (queue.length > 0) {

        const tmp = queue.shift();

        if (tmp !== undefined) {
            const cell = tmp.cell;
            const path = tmp.path;
            const x = cell.x;
            const y = cell.y;


            if (x === end.x && y === end.y) {
                return path;
            }

            const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
            for (const [dx, dy] of directions) {
                const newX = x + dx, newY = y + dy;
                if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && !visited.has(`${newX},${newY}`) && maze[newX][newY]) {

                    if (isReachable(cell, maze[newX][newY])) {
                        visited.add(`${newX},${newY}`);
                        queue.push({ cell: maze[newX][newY], path: [...path, maze[newX][newY]] });
                    }
                }
            }
        }
    }

    return [];

}


export function isReachable(cell1: Cell, cell2: Cell): boolean {

    if (cell1.y === cell2.y) {

        if (cell1.x > cell2.x) {
            if (!cell1.leftWall && !cell2.rightWall) return true;
        } else {
            if (!cell1.rightWall && !cell2.leftWall) return true;
        }

    } else if (cell1.x === cell2.x) {

        if (cell1.y > cell2.y) {
            if (!cell1.topWall && !cell2.bottomWall) return true;
        } else {
            if (!cell1.bottomWall && !cell2.topWall) return true;
        }

    }

    return false;
}