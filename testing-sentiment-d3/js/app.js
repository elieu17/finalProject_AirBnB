
// Add Donut Chart 

var width = 350,
    height = 390,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category10();

var pie = d3.layout.pie()
    .value(function(d) { return d.male; })
    .sort(null);

var arc = d3.svg.arc()
    .innerRadius(radius - 95)
    .outerRadius(radius - 40);

var svg = d3.select(".sunburst-chart").append("svg")
    .attr("width", width + 5)
    .attr("height", height -10)
    .append("g")
    .text("one")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("./js/data1.csv", type, function(error, data) {
  if (error) throw error;

  var path = svg.datum(data).selectAll("path")
      .data(pie)
      .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc)
      .each(function(d) { this._current = d; }); // store the initial angles

  d3.selectAll("input")
      .on("change", change);


  var timeout = setTimeout(function() {
    d3.select("input[value=\"oranges\"]").property("checked", true).each(change);
  }, 2000);

  // Data
  var femeData = [29,69,2];
  var maleData = [31,67,1];
  
  //------------ 
  function change() {
    var value = this.value;
    //console.log(value);
    // update results data on click change----------------
    if (value == "female") {
      d3.selectAll(".resultsP")
      .data(femeData)
      .text(function (d, i) {
        return (d + "%");
        });
      console.log("female");
    } else if ( value == "male") {
      d3.selectAll(".resultsP")
      .data(maleData)
      .text(function (d, i) {
        return (d + "%");
        });
      console.log("male")
    }
    clearTimeout(timeout);
    pie.value(function(d) {
       return d[value]; 
      }); // change the value function
    path = path.data(pie); // compute the new angles
    path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
    
  }
});

function type(d) {
  d.male = +d.male;
  d.female = +d.female;
  return d;
}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

//-----------------------------------------------------------------------------------------------------
// Append Timeline

var svgContainer = d3.select(".timeline-chart").append("svg")
  .attr("width", 400)
  .attr("height", 300);


   //Draw the line

 var circle = svgContainer.append("line")
 .attr("x1", 500)
 .attr("y1", 10)
  .attr("x2", 25)
  .attr("y2", 5)
  .attr("stroke-width", 10)
  .attr("stroke", "blue");

 


//-----------------------------------------------------------------------------------------------------
// // append population pyramid

// // SET UP DIMENSIONS
// var w = 500,
//     h = 300;
    
// // margin.middle is distance from center line to each y-axis
// var margin = {
//   top: 20,
//   right: 20,
//   bottom: 24,
//   left: 20,
//   middle: 28
// };
    
// // the width of each side of the chart
// var regionWidth = w/2 - margin.middle;

// // these are the x-coordinates of the y-axes
// var pointA = regionWidth,
//     pointB = w - regionWidth;

// // some contrived data`
// var exampleData = [
//   {group: '0-9', male: 10, female: 12},
//   {group: '10-19', male: 14, female: 15},
//   {group: '20-29', male: 15, female: 18},
//   {group: '30-39', male: 18, female: 18},
//   {group: '40-49', male: 21, female: 22},
//   {group: '50-59', male: 19, female: 24},
//   {group: '60-69', male: 15, female: 14},
//   {group: '70-79', male: 8, female: 10},
//   {group: '80-89', male: 4, female: 5},
//   {group: '90-99', male: 2, female: 3},
//   {group: '100-109', male: 1, female: 1},
// ];

// // GET THE TOTAL POPULATION SIZE AND CREATE A FUNCTION FOR RETURNING THE PERCENTAGE
// var totalPopulation = d3.sum(exampleData, function(d) { return d.male + d.female; }),
//     percentage = function(d) { return d / totalPopulation; };
  
  
// // CREATE SVG
// var svg2 = d3.select('.pyramid-chart').append('svg')
//   .attr('width', margin.left + w + margin.right)
//   .attr('height', margin.top + h + margin.bottom)
//   // ADD A GROUP FOR THE SPACE WITHIN THE MARGINS
//   .append('g')
//     .attr('transform', translation(margin.left, margin.top));

// // find the maximum data value on either side
// //  since this will be shared by both of the x-axes
// var maxValue = Math.max(
//   d3.max(exampleData, function(d) { return percentage(d.male); }),
//   d3.max(exampleData, function(d) { return percentage(d.female); })
// );

// // SET UP SCALES
  
// // the xScale goes from 0 to the width of a region
// //  it will be reversed for the left x-axis
// var xScale = d3.scale.linear()
//   .domain([0, maxValue])
//   .range([0, regionWidth])
//   .nice();

// var xScaleLeft = d3.scale.linear()
//   .domain([0, maxValue])
//   .range([regionWidth, 0]);

// var xScaleRight = d3.scale.linear()
//   .domain([0, maxValue])
//   .range([0, regionWidth]);

// var yScale = d3.scale.ordinal()
//   .domain(exampleData.map(function(d) { return d.group; }))
//   .rangeRoundBands([h,0], 0.1);


// // SET UP AXES
// var yAxisLeft = d3.svg.axis()
//   .scale(yScale)
//   .orient('right')
//   .tickSize(4,0)
//   .tickPadding(margin.middle-4);

// var yAxisRight = d3.svg.axis()
//   .scale(yScale)
//   .orient('left')
//   .tickSize(4,0)
//   .tickFormat('');

// var xAxisRight = d3.svg.axis()
//   .scale(xScale)
//   .orient('bottom')
//   .tickFormat(d3.format('%'));

// var xAxisLeft = d3.svg.axis()
//   // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
//   .scale(xScale.copy().range([pointA, 0]))
//   .orient('bottom')
//   .tickFormat(d3.format('%'));

// // MAKE GROUPS FOR EACH SIDE OF CHART
// // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
// var leftBarGroup = svg2.append('g')
//   .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
// var rightBarGroup = svg2.append('g')
//   .attr('transform', translation(pointB, 0));

// // DRAW AXES
// svg2.append('g')
//   .attr('class', 'axis y left')
//   .attr('transform', translation(pointA, 0))
//   .call(yAxisLeft)
//   .selectAll('text')
//   .style('text-anchor', 'middle');

// svg2.append('g')
//   .attr('class', 'axis y right')
//   .attr('transform', translation(pointB, 0))
//   .call(yAxisRight);

// svg2.append('g')
//   .attr('class', 'axis x left')
//   .attr('transform', translation(0, h))
//   .call(xAxisLeft);

// svg2.append('g')
//   .attr('class', 'axis x right')
//   .attr('transform', translation(pointB, h))
//   .call(xAxisRight);

// // DRAW BARS
// leftBarGroup.selectAll('.bar.left')
//   .data(exampleData)
//   .enter().append('rect')
//     .attr('class', 'bar left')
//     .attr('x', 0)
//     .attr('y', function(d) { return yScale(d.group); })
//     .attr('width', function(d) { return xScale(percentage(d.male)); })
//     .attr('height', yScale.rangeBand());

// rightBarGroup.selectAll('.bar.right')
//   .data(exampleData)
//   .enter().append('rect')
//     .attr('class', 'bar right')
//     .attr('x', 0)
//     .attr('y', function(d) { return yScale(d.group); })
//     .attr('width', function(d) { return xScale(percentage(d.female)); })
//     .attr('height', yScale.rangeBand());


// // so sick of string concatenation for translations
// function translation(x,y) {
//   return 'translate(' + x + ',' + y + ')';
// }