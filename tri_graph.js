// javascript for the total population line graph

const trisvg = d3.select("#tri_graph");
const linewidth = 1200;
const lineheight = 370;

const linemargin = { top: 30, right: 40, bottom: 40, left: 40 };
const lineWidth = linewidth - linemargin.left - linemargin.right;
const lineHeight = lineheight - linemargin.top - linemargin.bottom;
const line_graph = trisvg.append("g").attr("id", "line_graph")
  .attr("transform", "translate(" + (linemargin.left + 60) + "," + (linemargin.top) + ")");;



const vis_line = async () => {
  let line_data = await d3.csv("inflow-outflow.csv");

  // change all dates from strings to d3 datetime objects
  let date_parser = d3.timeParse("%Y-%m-%d")
  line_data.forEach(d => {
    d["date"] = date_parser(d["date"])
    d["year"] = d["date"].getFullYear();
    d["month"] = Number(d["date"].getMonth()) + Number(1);
  });

  console.log(line_data)

  // const yearExtent = d3.extent(line_data, d => d["year"]);
  const yearScale = d3.scaleTime().domain([new Date("2020-01-01"), new Date("2021-03-20")]).range([0, lineWidth - 2]);

  // const distExtent = d3.extent(distances_per_yr_dict, d => d["max_dist"]);
  const flowExtent = [1900, 3500]
  const flowScale = d3.scaleLinear().domain(flowExtent).range([lineHeight, 0]);

  var active_point;

  let leftAxis = d3.axisLeft(flowScale)
  let leftGridlines = d3.axisLeft(flowScale)
    .tickSize(-lineWidth - 10)
    .tickFormat("")

  line_graph.append("g")
    .attr("class", "y1-axis")
    .attr("transform", "translate(" + (linemargin.left + 10) + "," + linemargin.top + ")")
    .attr("fill", "#e5e5e5")
    .attr("stroke", "#e5e5e5")
    .call(leftAxis)

  line_graph.append("g")
    .attr("class", "y1-gridlines")
    .attr("fill", "#e5e5e5")
    .attr("stroke", "#e5e5e5")
    .attr("opacity", 1)
    .attr("transform", "translate(" + (linemargin.left + 10) + "," + linemargin.top + ")")
    .call(leftGridlines)

  line_graph.append("text")
    .attr("transform", "translate(" + (5) + "," + (lineheight / 2) + ")rotate(-90)")
    .style("text-anchor", "middle")
    .attr("stroke", "#e5e5e5")
    .attr("font-family", "Inter")
    .attr("font-size", "13px")
    .attr("fill", "#e5e5e5")
    .text("Total Population")

  line_graph.append("text")
    .attr("transform", "translate(" + (linewidth / 2) + "," + (10) + ")")
    .style("text-anchor", "middle")
    .attr("stroke", "#e5e5e5")
    .attr("font-family", "Inter")
    .attr("font-size", "18px")
    .attr("fill", "#e5e5e5")
    .text("Total Homeless Population of Charlotte, Jan 2020 - Feb 2021")


  line_graph.append("text")
    .attr("transform", "translate(" + (linewidth / 2) + "," + (lineheight) + ")")
    .style("text-anchor", "middle")
    .attr("stroke", "#e5e5e5")
    .attr("font-family", "Inter")
    .attr("font-size", "13px")
    .attr("fill", "#e5e5e5")
    .text("Date")


  let bottomAxis = d3.axisBottom(yearScale)
  let bottomGridlines = d3.axisBottom(yearScale)
    .tickSize(-lineHeight - 10)
    .tickFormat(d3.timeFormat("%b %Y"))
    .ticks(28)



  line_graph.append("g")
    .attr("class", "x-gridlines")
    .attr("fill", "#e5e5e5")
    .attr("stroke", "#e5e5e5")
    .attr("opacity", 1)
    .attr("transform", "translate(" + (linemargin.left + 10) + "," + (lineHeight + linemargin.top) + ")")
    .call(bottomGridlines)

  line_graph.selectAll("circle")
    .data(line_data)
    .join("circle")
    .attr("fill", "#fca311")
    .attr("r", "4px")
    .attr("cx", (function (d) { return yearScale(d.date) + 50 }))
    .attr("cy", (function (d) { return flowScale(d.total) + 32 }))

  // Add the line
  line_graph.append("path")
    .datum(line_data)
    .attr("fill", "none")
    .attr("stroke", "#fca311")
    .attr("stroke-width", 2)
    .attr("z-index", 99)
    .attr("d", d3.line()
      //  .curve(d3.curveBasis) // Just add that to have a curve instead of segments
      .x(function (d) { return yearScale(d.date) + 50 })
      .y(function (d) { return flowScale(d.total) + 32 })
    )

  let linemouseGroup = line_graph.append("g");

  let select_rect = linemouseGroup.append("rect")
    .attr("id", "select_rect")
    .attr("x", lineWidth-105)
    .attr("y", 30)
    .attr("fill", "lightgrey")
    .attr("width", "130px")
    .attr("z-index", 1)
    .attr("height", lineHeight)
    .attr("opacity", .3);

  let valuemark = linemouseGroup.append("circle")
    .attr("id", "value")
    .attr("fill", "none")
    .attr("stroke", "#fca311")
    .attr("stroke-width", 2)
    .attr("r", 10)
    .attr("z-index", 99)
    .attr("opacity", 0);

  let active = linemouseGroup.append("rect")
    .attr("id", "active")
    .attr("width", lineWidth)
    .attr("height", lineHeight)
    .attr("fill", "none")
    .attr("pointer-events", "all");


  let pop_label = linemouseGroup.append("text")
    .attr("id", "label")
    .attr("stroke", "#e5e5e5")
    .attr("fill", "#e5e5e5")
    .attr("opacity", 0);

  let find_closest_x = d3.bisector(d => d.date).right;

  active.on("mouseover", function () {
    valuemark.attr("opacity", 1);
    pop_label.attr("opacity", 1);
  });

  active.on("mouseout", function () {
    // Hide them when mousing out of chart
    valuemark.attr("opacity", 0);
    pop_label.attr("opacity", 0);
  });


const trisvg2 = d3.select("#tri_timeline");

const tlwidth = 3400;
const tlheight = 370;

const tlmargin = { top: 60, right: 40, bottom: 40, left: 40 };
const tlWidth = tlwidth - tlmargin.left - tlmargin.right;
const tlHeight = tlheight - tlmargin.top - tlmargin.bottom;
const timeline = trisvg2.append("g").attr("id", "timeline")
  .attr("transform", "translate(" + (-4800) + "," + (tlmargin.top) + ")")


  // let line_data = await d3.csv("inflow-outflow.csv");

  // // change all dates from strings to d3 datetime objects
  // let date_parser = d3.timeParse("%Y-%m-%d")
  // line_data.forEach(d => {
  //   d["date"] = date_parser(d["date"])
  //   d["year"] = d["date"].getFullYear();
  //   d["month"] = Number(d["date"].getMonth()) + Number(1);
  // });

  // console.log(line_data)

  // // const yearExtent = d3.extent(line_data, d => d["year"]);
  // const yearScale = d3.scaleTime().domain([new Date("2020-01-01"), new Date("2021-02-20")]).range([0, lineWidth - 2]);

  // // const distExtent = d3.extent(distances_per_yr_dict, d => d["max_dist"]);
  // const flowExtent = [1900, 3500]
  // const flowScale = d3.scaleLinear().domain(flowExtent).range([lineHeight, 0]);


  timeline.append("text")
  .attr("font-size", "20px")
  .text("February 2021")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 5300)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("March 2021")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 5750)

  timeline.append("rect")
  .attr("width", "380px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("opacity", 0.3)
  .attr("height", "160px")
  .attr("x", 5220)
  .attr("y", 110)
  

  timeline.append("svg:image")
  .attr("xlink:href", "images/feb2021.png")
  .attr("height", "280px")
  .attr("x", 5215)
  .attr("y", 55)

 
  timeline.append("rect")
  .attr("width", "290px")
  .attr("fill", "#fca314")
  .attr("opacity", 0.4)
  .attr("height", "50px")
  .attr("x", 5140)
  .attr("y", 40)

  timeline.append("svg:image")
  .attr("xlink:href", "images/feb2021rats.png")
  .attr("height", "280px")
  .attr("x", 5095)
  .attr("y", -10)


  timeline.append("text")
  .attr("font-size", "20px")
  .text("January 2021")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 4900)

  timeline.append("rect")
  .attr("width", "310px")
  .attr("fill", "#323232")
  .attr("opacity", 0.4)
  .attr("height", "180px")
  .attr("x", 4685)
  .attr("y", 40)

  timeline.append("svg:image")
  .attr("xlink:href", "images/jan2021.png")
  .attr("height", "280px")
  .attr("x", 4640)
  .attr("y", -5)

  timeline.append("svg:image")
  .attr("xlink:href", "images/jantentcity.png")
  .attr("height", "120px")
  .attr("x", 4970)
  .attr("y", 150)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("December 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 4400)

  timeline.append("rect")
  .attr("width", "370px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("opacity", 0.3)
  .attr("height", "175px")
  .attr("x", 4300)
  .attr("y", 90)

  timeline.append("svg:image")
  .attr("xlink:href", "images/dec2020.png")
  .attr("height", "280px")
  .attr("x", 4280)
  .attr("y", 45)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("November 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 4000)

  timeline.append("rect")
  .attr("width", "415px")
  .attr("fill", "#fca314")
  .attr("opacity", 0.4)
  .attr("height", "140px")
  .attr("x", 3800)
  .attr("y", 30)

  timeline.append("svg:image")
  .attr("xlink:href", "images/nov2020.png")
  .attr("height", "280px")
  .attr("x", 3810)
  .attr("y", -10)

  timeline.append("svg:image")
  .attr("xlink:href", "images/novtres.png")
  .attr("height", "120px")
  .attr("x", 4130)
  .attr("y", 160)

  timeline.append("svg:image")
  .attr("xlink:href", "images/novtres2.png")
  .attr("height", "120px")
  .attr("x", 4000)
  .attr("y", 160)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("October 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 3600)

  timeline.append("rect")
  .attr("width", "250px")
  .attr("fill", "#323232")
  .attr("opacity", 0.4)
  .attr("height", "120px")
  .attr("x", 3500)
  .attr("y", 140)

  timeline.append("svg:image")
  .attr("xlink:href", "images/oct2020.png")
  .attr("height", "280px")
  .attr("x", 3510)
  .attr("y", 105)

  timeline.append("svg:image")
  .attr("xlink:href", "images/octpic.png")
  .attr("height", "100px")
  .attr("x", 3630)
  .attr("y", 40)

  // September 2020

  timeline.append("text")
  .attr("font-size", "20px")
  .text("September 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 3200)

  timeline.append("rect")
  .attr("width", "310px")
  .attr("fill", "white")
  .attr("opacity", 0.3)
  .attr("height", "160px")
  .attr("x", 3135)
  .attr("y", 30)

  timeline.append("svg:image")
  .attr("xlink:href", "images/sep2020.png")
  .attr("height", "280px")
  .attr("x", 3150)
  .attr("y", -5)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("August 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 2800)


  timeline.append("rect")
  .attr("width", "375px")
  .attr("fill", "#fca314")
  .attr("opacity", 0.3)
  .attr("height", "142px")
  .attr("x", 2745)
  .attr("y", 120)

  timeline.append("svg:image")
  .attr("xlink:href", "images/aug2020-2.png")
  .attr("height", "280px")
  .attr("x", 2754)
  .attr("y", 81)

  //aug 2020 1


  timeline.append("rect")
  .attr("width", "352px")
  .attr("fill", "#fca314")
  .attr("opacity", 0.3)
  .attr("height", "80px")
  .attr("x", 2460)
  .attr("y", 20)

  timeline.append("svg:image")
  .attr("xlink:href", "images/aug2020-1.png")
  .attr("height", "280px")
  .attr("x", 2474)
  .attr("y", -20)


  timeline.append("text")
  .attr("font-size", "20px")
  .text("July 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 2400)


  timeline.append("rect")
  .attr("width", "272px")
  .attr("fill", "white")
  .attr("opacity", 0.3)
  .attr("height", "110px")
  .attr("x", 2360)
  .attr("y", 140)

  timeline.append("svg:image")
  .attr("xlink:href", "images/july2020.png")
  .attr("height", "274px")
  .attr("x", 2366)
  .attr("y", 100)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("June 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 2000)


  timeline.append("text")
  .attr("font-size", "20px")
  .text("May 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 1600)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("April 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 1200)


  timeline.append("text")
  .attr("font-size", "20px")
  .text("March 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 800)



  timeline.append("rect")
  .attr("width", "385px")
  .attr("fill", "white")
  .attr("opacity", 0.3)
  .attr("height", "74px")
  .attr("x", 800)
  .attr("y", 175)

  timeline.append("svg:image")
  .attr("xlink:href", "images/march2020-2.png")
  .attr("height", "274px")
  .attr("x", 803)
  .attr("y", 135)

  timeline.append("rect")
  .attr("width", "280px")
  .attr("fill", "#fca314")
  .attr("opacity", 0.3)
  .attr("height", "110px")
  .attr("x", 640)
  .attr("y", 25)

  timeline.append("svg:image")
  .attr("xlink:href", "images/march2020-1.png")
  .attr("height", "274px")
  .attr("x", 643)
  .attr("y", -15)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("February 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 400)

  timeline.append("rect")
  .attr("width", "345px")
  .attr("fill", "white")
  .attr("opacity", 0.3)
  .attr("height", "90px")
  .attr("x", 280)
  .attr("y", 185)

  timeline.append("svg:image")
  .attr("xlink:href", "images/feb2020.png")
  .attr("height", "274px")
  .attr("x", 283)
  .attr("y", 140)

  timeline.append("svg:image")
  .attr("xlink:href", "images/kiplin.jpeg")
  .attr("height", "134px")
  .attr("x", 213)
  .attr("y", 25)


  // timeline.append("rect")
  // .attr("width", "345px")
  // .attr("fill", "#323232")
  // .attr("opacity", 0.3)
  // .attr("height", "20px")
  // .attr("x", 20)
  // .attr("y", 85)

  // timeline.append("svg:image")
  // .attr("xlink:href", "images/jan2020.png")
  // .attr("height", "274px")
  // .attr("x", 23)
  // .attr("y", 20)


  timeline.append("text")
  .attr("font-size", "20px")
  .text("January 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 0)

  timeline.append("rect")
  .attr("width", "5750px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "3px")
  .attr("x", 60)
  .attr("y", 300)

  // TICK MARKS

  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 60)
  .attr("y", 285)


  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 5810)
  .attr("y", 285)


  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 460)
  .attr("y", 285)

  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 860)
  .attr("y", 285)

  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 1250)
  .attr("y", 285)

  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 1650)
  .attr("y", 285)


  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 2050)
  .attr("y", 285)

  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 2450)
  .attr("y", 285)

  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 2860)
  .attr("y", 285)

  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 3280)
  .attr("y", 285)

  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 3670)
  .attr("y", 285)


  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 4080)
  .attr("y", 285)

  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 4480)
  .attr("y", 285)


  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 4970)
  .attr("y", 285)


  timeline.append("rect")
  .attr("width", "3px")
  .attr("stroke", "white")
  .attr("fill", "white")
  .attr("height", "30px")
  .attr("x", 5390)
  .attr("y", 285)

  timeline.append("rect")
  .attr("width", "390px")
  .attr("fill", "#323232")
  .attr("opacity", 0.3)
  .attr("height", "110px")
  .attr("x", 1860)
  .attr("y", 20)

  timeline.append("svg:image")
  .attr("xlink:href", "images/june2020.png")
  .attr("height", "274px")
  .attr("x", 1866)
  .attr("y", -20)

  timeline.append("svg:image")
  .attr("xlink:href", "images/jun2020_img.jpeg")
  .attr("height", "120px")
  .attr("x", 2136)
  .attr("y", 143)


  // May 2020


  // timeline.append("rect")
  // .attr("width", "390px")
  // .attr("fill", "#323232")
  // .attr("opacity", 0.3)
  // .attr("height", "110px")
  // .attr("x", 1660)
  // .attr("y", 20)

  // timeline.append("svg:image")
  // .attr("xlink:href", "images/may2020.png")
  // .attr("height", "274px")
  // .attr("x", 1666)
  // .attr("y", -20)

  // April 2020


  timeline.append("rect")
  .attr("width", "270px")
  .attr("fill", "rgb(252, 163, 20)")
  .attr("opacity", 0.3)
  .attr("height", "124px")
  .attr("x", 1310)
  .attr("y", 115)

  timeline.append("svg:image")
  .attr("xlink:href", "images/april2020-2.png")
  .attr("height", "274px")
  .attr("x", 1313)
  .attr("y", 75)

  timeline.append("rect")
  .attr("width", "385px")
  .attr("fill", "white")
  .attr("opacity", 0.3)
  .attr("height", "74px")
  .attr("x", 1020)
  .attr("y", 20)

  timeline.append("svg:image")
  .attr("xlink:href", "images/april2020-1.png")
  .attr("height", "274px")
  .attr("x", 1023)
  .attr("y", -20)



  active.on("mousemove", function () {
    let mouse_loc = d3.pointer(event);
    let x = mouse_loc[0] - 70;
    let xyear = yearScale.invert(x);
    let i = find_closest_x(line_data, xyear);
    let d = line_data[i];

    let xPos = yearScale(d['date']) + 50;
    let yPos = flowScale(d["total"]) + 32;
    valuemark.attr("cx", xPos).attr("cy", yPos);
    select_rect.attr('x', x + 10).attr("y", 30);
    timeline.attr("transform", "translate(" + (4.4*-1.05*x-.01*-x) + "," + (tlmargin.top) + ")")
    
    // WHEN THE MOUSE MOVES, INVERT AND MOVE THE SVG TIMELINE THE SAME WAY

    let txt = Math.round(d["total"])

    pop_label.text(txt);
    if (xPos < lineWidth / 2.0) {
      pop_label.attr("x", xPos + 4).attr("y", yPos - 15).attr("text-anchor", "start");
    }
    else {
      pop_label.attr("x", xPos + 4).attr("y", yPos - 15).attr("text-anchor", "start");
    }

  });


  



}
vis_line();

