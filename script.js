if (screen.width < 600){
  // set mobile dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
  width = (window.innerWidth * .9) - margin.top - margin.bottom,
  height = width;
}
else{
  // set computer dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
  height = (window.innerHeight * .8) - margin.top - margin.bottom,
  width = height;
}
    
// append the svg object to the body of the page
var svg = d3.select("#lineplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// svg.append("text")
//   .attr("x", (width / 2))             
//   .attr("y", (0))
//   .attr("text-anchor", "middle")  
//   .style("font-size", "26px")  
//   .text("Brooklyn");

// add 'restart' text
svg.append("text")
  .attr("x", width - 25)             
  .attr("y", height)
  .attr("text-anchor", "middle")  
  .style("font-size", "26px")  
  .html('&#8635')
  .attr("class", "test")
  .on("mouseover", function(){
    this.style.fontSize = "20px";
    this.innerHTML = 'Replay';
  })
  .on("mouseout", function(){
    this.style.fontSize = "26px";
    this.innerHTML = '&#8635';
  })
  .on("click", function(){
    svg.selectAll('path').remove();
    startMap("data/chicago_run.csv");
  });

// function to start the animation
function startMap(dataPath){

  document.body.style.cursor = 'wait';
  svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", (height / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "26px")  
    .html("&#x231b")
    .attr("id", "loadingIcon");

  //Read the data
  d3.csv(dataPath, function(data) {

    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
      .key(function(d) { return d.Index;})
      .entries(data);
    sumstatCopy = sumstat;

    // Add X axis
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return Number(d.Longitude); }))
      .range([ 0, width ]);

    // Add Y axis
    var y = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return Number(d.Latitude); }))
      .range([ height, 0 ]);

    document.body.style.cursor = 'default';
    document.getElementById("loadingIcon").remove();

    // Draw the lines
    svg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("class", "runPath")
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.Longitude); })
            .y(function(d) { return y(d.Latitude); })
            (d.values)
        })
        .style("stroke", "red") // line starts out as red and with 0.8 opacity
        .style("opacity", 0.8)
        .attr('stroke-dasharray', function(d, i){ return this.getTotalLength();}) // line starts completely in a dash offset
        .attr('stroke-dashoffset', function(d){ return this.getTotalLength();})
        .transition()
        .duration(function(d){ return speed * this.getTotalLength();}) // makes animation time correspond to length of run line
        .ease(d3.easeLinear)
        .delay(function(d,i){return delayLength(i)}) // remove this to start all lines animations at the same time
        .attr('stroke-dashoffset', 0) // transition dash offset to 0, creating animation illusion
        .transition()
        .duration(500)
        .style("opacity", 0.15) // fade line out
        .style("stroke", "#001933"); // fade line to blue
  });
}

function delayLength(i, total_length = 0){
  //Use recursion to find sum of all previous line lengths
  if (i==0){
    return total_length
  } 
  else{
    return (speed * d3.selectAll("path")._groups[0][i - 1].getTotalLength()) + delayLength(i-1, total_length)
  }
}

////////////////////////////////////////////////////////////////////////

// start drawing NYC - eventually this should be triggered via scrolling svg into view
startMap("data/nyc_run.csv");

// 1 = fast, 1.5 = medium, 2 = slow
speed = 2;

d3.select("#slowButton")
  .on("click", function(){
    svg.selectAll('path').remove();
    speed = 4; 
    startMap("data/nyc_run.csv");

    this.style.backgroundColor = "#001933";
    this.style.color = "white";

    document.getElementById("mediumButton").style.backgroundColor = "white";
    document.getElementById("mediumButton").style.color = "#001933";
    document.getElementById("fastButton").style.backgroundColor = "white";
    document.getElementById("fastButton").style.color = "#001933";
  });
d3.select("#mediumButton")
  .on("click", function(){
    svg.selectAll('path').remove();
    speed = 2; 
    startMap("data/nyc_run.csv");

    this.style.backgroundColor = "#001933";
    this.style.color = "white";

    document.getElementById("slowButton").style.backgroundColor = "white";
    document.getElementById("slowButton").style.color = "#001933";
    document.getElementById("fastButton").style.backgroundColor = "white";
    document.getElementById("fastButton").style.color = "#001933";
  });
d3.select("#fastButton")
  .on("click", function(){
    svg.selectAll('path').remove();
    speed = 1; 
    startMap("data/nyc_run.csv");

    this.style.backgroundColor = "#001933";
    this.style.color = "white";

    document.getElementById("slowButton").style.backgroundColor = "white";
    document.getElementById("slowButton").style.color = "#001933";
    document.getElementById("mediumButton").style.backgroundColor = "white";
    document.getElementById("mediumButton").style.color = "#001933";
  });