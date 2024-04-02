import { BinaryHeap } from "../utils/binaryHeap";
import { Cell } from "./cell";
import { Edge } from "./edge";


export class Maze {

    private cells: Cell[][] = [];
    private edges: Edge[] = [];
    private edgeIndex = new Set<string>();
    private usedCells: Cell[] = [];

    constructor(private width: number, private height: number) {

        for (let i = 0; i < width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < height; j++) {
                this.cells[i][j] = new Cell('cell', i, j);
            }
        }

        this.generateEdges();

        const randomX = 0;//Math.floor(Math.random() * width / 2);
        const randomY = 0;//Math.floor(Math.random() * height / 2);

        this.cells[randomX][randomY].type = 'start';
        this.cells[randomX][randomY].isUsed = true;

        this.usedCells.push(this.cells[randomX][randomY]);

        const randomEndX = width - 1
        const randomEndY = height - 1

        this.cells[randomEndX][randomEndY].type = 'end';
    }

    private generateEdges() {

        const tmpCells = this.cells.flat();

        tmpCells.forEach(cell => {

            const neighbours = this.findNeighbour(cell, false);

            neighbours.forEach(neighbour => {

                if (
                    !this.edgeIndex.has(`${neighbour.getKey()}:${cell.getKey()}`)
                    && !this.edgeIndex.has(`${cell.getKey()}:${neighbour.getKey()}`)
                ) {
                    const randomWeight = Math.random() //Math.floor(Math.random() * this.width * this.height);
                    const edge = new Edge(cell, neighbour, randomWeight);
                    this.edges.push(edge);
                    cell.edges.push(edge);
                    neighbour.edges.push(edge);
                    this.edgeIndex.add(`${neighbour.getKey()}:${cell.getKey()}`);
                }
            });
        });

        this.edgeIndex.clear();
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
        if (type === 'bfs') {
            this.cells[x][y].isBfs = true;
        } else if (type === 'astar') {
            this.cells[x][y].isAStar = true;
        }

    }

    public generate() {

        const start = this.getStart();
        const binaryHeap = new BinaryHeap<Edge>((a, b) => a.weight - b.weight);

        start.edges.forEach(edge => binaryHeap.insert(edge));

        while (!binaryHeap.isEmpty()) {

            const minEdge = binaryHeap.extractMin();

            if (minEdge !== undefined && !minEdge.cell2.isUsed) {
                minEdge.cell2.isUsed = true;
                this.suppressWall(minEdge.cell1, minEdge.cell2);
                minEdge.cell2.edges.forEach(edge => binaryHeap.insert(edge));
            }
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