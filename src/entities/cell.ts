

export class Cell {

    public topWall: boolean = true;
    public rightWall: boolean = true;
    public bottomWall: boolean = true;
    public leftWall: boolean = true;
    public isUsed: boolean = false;
    public isPath: boolean = false;

    constructor(public type: string, public x: number, public y: number) { }

    public getClass() {

        let className = 'cell';

        if (this.type === 'start') {
            className += ' start';
        } else if (this.type === 'end') {
            className += ' end';
        } else if (this.isPath) {
            className += ' path';
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