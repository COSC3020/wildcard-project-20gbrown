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

  console.log('Dijkstra Result:', result);

  for (const node in result) {
    if (result[node] < 0) {
      console.error('Negative distance found:', result[node]);
      return false;
    }
  }

  return true;
});

jsc.assert(test, { tests: 1000 });

const graph1 = {
  A: { B: 1, C: 4 },
  B: { A: 1, C: 2, D: 5 },
  C: { A: 4, B: 2, D: 1 },
  D: { B: 5, C: 1 }
};

const graph2 = {
  X: { Y: 2, Z: 5 },
  Y: { X: 2, Z: 3 },
  Z: { X: 5, Y: 3 }
};

const graph3 = {
  S: { A: 3, B: 5, C: 1 },
  A: { S: 3, B: 2, D: 4 },
  B: { S: 5, A: 2, D: 2, E: 7 },
  C: { S: 1, E: 8 },
  D: { A: 4, B: 2, E: 1 },
  E: { B: 7, C: 8, D: 1 }
};

// Expected Results
const expectedResults = {
  graph1: {
    A: 0,
    B: 1,
    C: 3,
    D: 4
  },
  graph2: {
    X: 0,
    Y: 2,
    Z: 5
  },
  graph3: {
    S: 0,
    A: 3,
    B: 5,
    C: 1,
    D: 7,
    E: 8
  },
};

const result1 = dijkstra(graph1, 'A');
console.log('Test 1:', JSON.stringify(result1) === JSON.stringify(expectedResults.graph1) ? 'Passed' : 'Failed');

const result2 = dijkstra(graph2, 'X');
console.log('Test 2:', JSON.stringify(result2) === JSON.stringify(expectedResults.graph2) ? 'Passed' : 'Failed');

const result3 = dijkstra(graph3, 'S');
console.log('Test 3:', JSON.stringify(result3) === JSON.stringify(expectedResults.graph3) ? 'Passed' : 'Failed');
console.timeEnd('Unoptimized time')
