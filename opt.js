//opt.js

class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    enqueue(element, priority) {
        this.heap.push({ element, priority });
        this.bubbleUp();
    }

    dequeue() {
        const min = this.heap[0];
        const last = this.heap.pop();

        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.bubbleDown();
        }

        return min;
    }

    bubbleUp() {
        let currentIdx = this.heap.length - 1;

        while (currentIdx > 0) {
            const parentIdx = Math.floor((currentIdx - 1) / 2);

            if (this.heap[currentIdx].priority < this.heap[parentIdx].priority) {
                [this.heap[currentIdx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[currentIdx]];
                currentIdx = parentIdx;
            } else {
                break;
            }
        }
    }

    bubbleDown() {
        let currentIdx = 0;

        while (true) {
            const leftChildIdx = 2 * currentIdx + 1;
            const rightChildIdx = 2 * currentIdx + 2;
            let smallestChildIdx = currentIdx;

            if (leftChildIdx < this.heap.length && this.heap[leftChildIdx].priority < this.heap[smallestChildIdx].priority) {
                smallestChildIdx = leftChildIdx;
            }

            if (rightChildIdx < this.heap.length && this.heap[rightChildIdx].priority < this.heap[smallestChildIdx].priority) {
                smallestChildIdx = rightChildIdx;
            }

            if (smallestChildIdx !== currentIdx) {
                [this.heap[currentIdx], this.heap[smallestChildIdx]] = [this.heap[smallestChildIdx], this.heap[currentIdx]];
                currentIdx = smallestChildIdx;
            } else {
                break;
            }
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

function dijkstra(graph, sourceNode) {
    const dist = {};
    const priorityQueue = new PriorityQueue();

    for (const vertex in graph) {
        dist[vertex] = Infinity;
    }
    dist[sourceNode] = 0;

    priorityQueue.enqueue(sourceNode, 0);

    while (!priorityQueue.isEmpty()) {
        const { element: minDistVertex, priority: minDist } = priorityQueue.dequeue();

        for (const neighbor in graph[minDistVertex]) {
            const weight = graph[minDistVertex][neighbor];
            const altDist = dist[minDistVertex] + weight;

            if (altDist < dist[neighbor]) {
                dist[neighbor] = altDist;
                priorityQueue.enqueue(neighbor, altDist);
            }
        }
    }

    return dist;
}