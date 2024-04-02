import { Edge } from "./edge";

export class Cell {

    public topWall: boolean = true;
    public rightWall: boolean = true;
    public bottomWall: boolean = true;
    public leftWall: boolean = true;
    public isUsed: boolean = false;

    public isAStar: boolean = false;
    public isBfs: boolean = false;

    public cost: number = 0;
    public heuristic: number = 0;
    public parent?: Cell;

    public edges: Edge[] = [];

    constructor(public type: string, public x: number, public y: number) { }


    public getIntactWallsCount(): number {
        let intactWalls = 4;

        if(!this.topWall) intactWalls--;
        if(!this.rightWall) intactWalls--;
        if(!this.bottomWall) intactWalls--;
        if(!this.leftWall) intactWalls--;

        return intactWalls;
    }

    public getTotalCost(): number {
        return this.cost + this.heuristic;
    }

    public getKey() {
        return `${this.x},${this.y}`;
    }

    public getClass() {

        let className = 'cell';

        if (this.type === 'start') {
            className += ' start';
        } else if (this.type === 'end') {
            className += ' end';
        } else {
            if (this.isBfs) {
                className += ' bfs'
            }
            if (this.isAStar) {
                className += ' astar'
            }
        }

        if (this.topWall) {
            className += ' topWall';
        } else {
            className += ' usedTopWall'
        }

        if (this.rightWall) {
            className += ' rightWall';
        } else {
            className += ' usedRightWall'
        }

        if (this.bottomWall) {
            className += ' bottomWall';
        } else {
            className += ' usedBottomWall'
        }

        if (this.leftWall) {
            className += ' leftWall';
        } else {
            className += ' usedLeftWall'
        }

        return className;

    }
}