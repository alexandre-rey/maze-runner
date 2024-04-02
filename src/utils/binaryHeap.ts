

export class BinaryHeap<T> {

    private heap: T[];
    private compare: (a: T, b: T) => number;


    constructor(compareFunction: (a: T, b: T) => number) {
        this.heap = [];
        this.compare = compareFunction;
    }

    private leftChildIndex(parentIndex: number): number {
        return 2 * parentIndex + 1;
    }

    private rightChildIndex(parentIndex: number): number {
        return 2 * parentIndex + 2;
    }

    private parentIndex(childIndex: number): number {
        return Math.floor((childIndex - 1) / 2);
    }

    private hasLeftChild(index: number): boolean {
        return this.leftChildIndex(index) < this.heap.length;
    }

    private hasRightChild(index: number): boolean {
        return this.rightChildIndex(index) < this.heap.length;
    }

    private hasParent(index: number): boolean {
        return this.parentIndex(index) >= 0;
    }

    private leftChild(index: number): T {
        return this.heap[this.leftChildIndex(index)];
    }

    private rightChild(index: number): T {
        return this.heap[this.rightChildIndex(index)];
    }

    private parent(index: number): T {
        return this.heap[this.parentIndex(index)];
    }

    private swap(index1: number, index2: number): void {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    public insert(data: T): void {
        this.heap.push(data);
        this.heapifyUp();
    }

    private heapifyUp(): void {

        let index = this.heap.length - 1;
        while (
            this.hasParent(index)
            && this.compare(this.parent(index), this.heap[index]) > 0
        ) {
            this.swap(this.parentIndex(index), index);
            index = this.parentIndex(index);
        }
    }

    public extractMin(): T | undefined {
        if (this.heap.length === 0) return undefined;
        if (this.heap.length === 1) return this.heap.pop();

        const item = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.heapifyDown();
        return item;
    }

    private heapifyDown(): void {
        let index = 0;
        while (this.hasLeftChild(index)) {
            const smallerChildIndex =
                this.hasRightChild(index)
                    && this.compare(this.rightChild(index), this.leftChild(index)) < 0
                    ? this.rightChildIndex(index)
                    : this.leftChildIndex(index);

            if (this.compare(this.heap[index], this.heap[smallerChildIndex]) < 0) {
                break;
            } else {
                this.swap(index, smallerChildIndex);
            }

            index = smallerChildIndex;
        }
    }

    public isEmpty(): boolean { return this.heap.length === 0; }

    public size(): number { return this.heap.length }

}