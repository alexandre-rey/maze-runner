import { Cell } from "./cell";


export class Edge {

    public cell1: Cell;
    public cell2: Cell;
    public weight: number;

    constructor(cell1: Cell, cell2: Cell, weight: number = 1) {
        this.cell1 = cell1;
        this.cell2 = cell2;
        this.weight = weight;
    }

}