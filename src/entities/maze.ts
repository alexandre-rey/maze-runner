import { bfs } from "../bfs";
import { Cell } from "./cell";


export class Maze {

    private cells: Cell[][] = [];
    private usedCells: Cell[] = [];

    constructor(private width: number, private height: number) {

        for (let i = 0; i < width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < height; j++) {
                this.cells[i][j] = new Cell('cell', i, j);
            }
        }

        const randomX = Math.floor(Math.random() * width / 2);
        const randomY = Math.floor(Math.random() * height / 2);

        this.cells[randomX][randomY].type = 'start';
        this.cells[randomX][randomY].isUsed = true;

        this.usedCells.push(this.cells[randomX][randomY]);

        const randomEndX = width - 1
        const randomEndY = height - 1

        this.cells[randomEndX][randomEndY].type = 'end';

        const startTime = new Date().getTime();
        const path = bfs(this.getStart(), this.getEnd(), this.cells);
        const endTime = new Date().getTime();

        console.log('Time to generate BFS solution: ', endTime - startTime, 'ms');

        path.forEach(cell => {
            this.cells[cell.x][cell.y].isBfs = true;
        });
    }

    public getCells() {
        return this.cells;
    }

    public setCells(cells: Cell[][]) {
        this.cells = cells;
        this.width = cells.length;
        this.height = cells[0].length;
    }

    public setCellPath(x: number, y: number, type: string) {
        if(type === 'bfs'){
            this.cells[x][y].isBfs = true;
        } else if(type === 'astar'){
            this.cells[x][y].isAStar = true;
        }
        
    }

    public generate() {
        while (this.hasUnusedCell()) {
            this.generateMaze();
        }
    }

    public getStart(): Cell {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.cells[i][j].type === 'start') {
                    return this.cells[i][j];
                }
            }
        }

        return this.cells[0][0];
    }

    public getEnd(): Cell {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.cells[i][j].type === 'end') {
                    return this.cells[i][j];
                }
            }
        }

        return this.cells[0][0];
    }


    private generateMaze() {

        let candidateCells: Cell[] = [];

        this.usedCells.forEach(usedCell => {
            candidateCells = this.addCellsWithoutDuplicates(candidateCells, this.findNeighbour(usedCell, false));
        });

        const randomCandidate = candidateCells[Math.floor(Math.random() * candidateCells.length)];
        const candidateNeighbours = this.findNeighbour(randomCandidate, true);
        let candidateNeighbour: Cell | null = null;

        if (candidateNeighbours.length === 1) {
            candidateNeighbour = candidateNeighbours[0];
        } else {
            candidateNeighbour = candidateNeighbours[Math.floor(Math.random() * candidateNeighbours.length)];
        }

        this.cells[candidateNeighbour.x][candidateNeighbour.y].isUsed = true;
        this.usedCells.push(this.cells[randomCandidate.x][randomCandidate.y]);

        this.suppressWall(randomCandidate, candidateNeighbour);


    }

    private addCellsWithoutDuplicates(target: Cell[], newCells: Cell[]): Cell[] {

        const result = target;
        newCells.forEach(cell => {
            if (!result.includes(cell)) {
                result.push(cell);
            }
        });

        return result;
    }

    private suppressWall(cell1: Cell, cell2: Cell) {

        if (cell1.y === cell2.y) {

            if (cell1.x > cell2.x) {
                this.cells[cell1.x][cell1.y].leftWall = false;
                this.cells[cell2.x][cell2.y].rightWall = false;
            } else {
                this.cells[cell1.x][cell1.y].rightWall = false;
                this.cells[cell2.x][cell2.y].leftWall = false;
            }

        } else if (cell1.x === cell2.x) {

            if (cell1.y > cell2.y) {
                this.cells[cell1.x][cell1.y].topWall = false;
                this.cells[cell2.x][cell2.y].bottomWall = false;
            } else {
                this.cells[cell1.x][cell1.y].bottomWall = false;
                this.cells[cell2.x][cell2.y].topWall = false;
            }

        }

        this.cells[cell1.x][cell1.y].isUsed = true;
        this.cells[cell2.x][cell2.y].isUsed = true;
    }

    private hasUnusedCell() {
        const totalCells = this.width * this.height;
        const usedCells = this.usedCells.length;

        return totalCells !== usedCells;
    }


    public findNeighbour(cell: Cell, used: boolean): Cell[] {

        const neighbour: Cell[] = [];

        //Top cell
        if (this.cells[cell.x] && this.cells[cell.x][cell.y - 1]) {


            if (used) {
                if (this.cells[cell.x][cell.y - 1].isUsed) {
                    neighbour.push(this.cells[cell.x][cell.y - 1]);
                }
            } else {
                if (!this.cells[cell.x][cell.y - 1].isUsed) {
                    neighbour.push(this.cells[cell.x][cell.y - 1]);
                }
            }
        }

        //Right cell
        if (this.cells[cell.x + 1] && this.cells[cell.x + 1][cell.y]) {
            if (used) {
                if (this.cells[cell.x + 1][cell.y].isUsed) {
                    neighbour.push(this.cells[cell.x + 1][cell.y]);
                }
            } else {
                if (!this.cells[cell.x + 1][cell.y].isUsed) {
                    neighbour.push(this.cells[cell.x + 1][cell.y]);
                }
            }
        }

        //Bottom cell
        if (this.cells[cell.x] && this.cells[cell.x][cell.y + 1]) {
            if (used) {
                if (this.cells[cell.x][cell.y + 1].isUsed) {
                    neighbour.push(this.cells[cell.x][cell.y + 1]);
                }
            } else {
                if (!this.cells[cell.x][cell.y + 1].isUsed) {
                    neighbour.push(this.cells[cell.x][cell.y + 1]);
                }
            }
        }

        //Left cell
        if (this.cells[cell.x - 1] && this.cells[cell.x - 1][cell.y]) {
            if (used) {
                if (this.cells[cell.x - 1][cell.y].isUsed) {
                    neighbour.push(this.cells[cell.x - 1][cell.y]);
                }
            } else {
                if (!this.cells[cell.x - 1][cell.y].isUsed) {
                    neighbour.push(this.cells[cell.x - 1][cell.y]);
                }
            }
        }


        return neighbour;

    }

}   