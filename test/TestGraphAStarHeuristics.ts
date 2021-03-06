///<reference path="../search/AStar"/>
///<reference path="./Graph"/>

// Dimensions of graph
var x_dim = 10;
var y_dim = 10;

// The map - coordinates with value true connects to their neighbours,
// with value false they do not.
var m: boolean[][] = []; 

// Add edges along the y-axis
var xAxis: boolean = true;
// Add edges along the x-axis
var yAxis: boolean = true;
// Add edges along the diagonals
var diags: boolean = false;

var g: N[][];

var start: N;
var end: N;

var stats = { nodesVisited: 0, nodesAdded: 0 }

function manhattan(end: N): Search.Heuristic<N> {
  return function(node: N): number {
    return Math.abs(end.x - node.x) + Math.abs(end.y - node.y);
  }
}

function straightLine(end: N): Search.Heuristic<N> {
  return function(node: N): number {
    return Math.sqrt(Math.pow(end.x - node.x, 2) + Math.pow(end.y - node.y, 2));
  }
}

function run(h: Search.Heuristic<N>, hn: string) {
  stats = { nodesVisited: 0, nodesAdded: 0 }
  var s = Search.aStar(h, (node: N) => node.value, stats);
  var p = s((n: N) => n.neighbours, start, (n: N) => n.value == end.value);

  console.log("\n---------------------------------------")
  console.log("Test with " + hn + " heuristic");
  console.log("---------------------------------------")

  if ( !p ) {
    console.log("> No path found");
  } else {
    console.log("Path:");
    console.log("  from: " + start.value);
    console.log("  to: " + end.value);
    console.log("  length: " + p.length);
    console.log("  steps:");
    var str = "";
    for (var i in p) {
      if ( i > 0 )
        str += " -> \n";
      str += "    " + p[i].value
    }
    console.log(str);
  }
  console.log("\nStats:");
  console.log("  nodes visited: " + stats.nodesVisited);
  console.log("  nodes added to queue: " + stats.nodesAdded);
  console.log("\nGraph visualization:");
  printGraph(m, p);
  console.log();
}


// Create map
for ( var y=0; y<y_dim; y++ ) { 
  var my = [];
  for ( var x=0; x<x_dim; x++ ) { 
    my.push(true);
  }
  m.push(my);
}

// Add obstacle to map
m[3][3] = false;
m[3][4] = false;
m[4][4] = false;
m[5][4] = false;
m[6][4] = false;

var g = graph(m, x_dim, y_dim, xAxis, yAxis, diags);

var start = g[0][0];
var end   = g[9][9];

console.log("\n\n+------------------------------------------------+");
console.log("|      Test aStar with different heuristics      |");
console.log("+------------------------------------------------+");

run(undefined, "zero");
run(manhattan(end), "manhattan");
run(straightLine(end), "straight line");
