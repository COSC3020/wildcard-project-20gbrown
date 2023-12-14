function dijkstra(graph, sourceNode) {
    const dist = {}; 
    const marked = {}; 
    const vertices = Object.keys(graph); 

    for (const vertex of vertices) {
        dist[vertex] = Infinity;
    }
    dist[sourceNode] = 0;

    while (Object.keys(marked).length < vertices.length) {
        let minDist = Infinity;
        let minDistVertex = null;

        for (const vertex of vertices) {
            if (!marked[vertex] && dist[vertex] < minDist) {
                minDist = dist[vertex];
                minDistVertex = vertex;
            }
        }

        if (minDistVertex === null) {
            break;
        }

        marked[minDistVertex] = true;

        for (const neighbor in graph[minDistVertex]) {
            const weight = graph[minDistVertex][neighbor];
            const altDist = dist[minDistVertex] + weight;

            if (altDist < dist[neighbor]) {
                dist[neighbor] = altDist;
            }
        }
    }

    return dist;
}