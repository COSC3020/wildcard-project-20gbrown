//Had ChatGPT help me generate a test file, I want to focus more on the runtime
const fs = require('fs');
const jsc = require('jsverify');

// Include your Dijkstra implementation from code.js
eval(fs.readFileSync('unOpt.js') + '');

// Define a custom generator for graph data
const graphGenerator = jsc.bless({
  generator: function(size) {
    const graph = {};
    const numNodes = jsc.integer(2, 10).generator(size); // Generate a random number of nodes

    for (let i = 0; i < numNodes; i++) {
      graph[`Node${i}`] = {};

      for (let j = 0; j < numNodes; j++) {
        if (i !== j) {
          graph[`Node${i}`][`Node${j}`] = jsc.integer(1, 100).generator(size); // Generate random edge weights
        }
      }
    }

    return graph;
  },
  shrink: jsc.shrink.noop,
});

console.time('Unoptimized time')
const test = jsc.forall(graphGenerator, function(graph) {
  const nodes = Object.keys(graph);
  const sourceNode = nodes[jsc.integer(0, nodes.length - 1)]; // Randomly select a source node
  const result = dijkstra(graph, sourceNode);

  for (const node in result) {
    if (result[node] < 0) {
      return false;
    }
  }

  return true;
});

jsc.assert(test, { tests: 1000 });
console.timeEnd('Unoptimized time')
