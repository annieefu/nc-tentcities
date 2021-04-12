// javascript for the total population line graph

const trisvg2 = d3.select("#tri_timeline");

const tlwidth = 3400;
const tlheight = 370;

const tlmargin = { top: 60, right: 40, bottom: 40, left: 0 };
const tlWidth = tlwidth - tlmargin.left - tlmargin.right;
const tlHeight = tlheight - tlmargin.top - tlmargin.bottom;
const timeline = trisvg2.append("g").attr("id", "timeline")
  .attr("transform", "translate(" + (tlmargin.left + 40) + "," + (tlmargin.top) + ")")



const vis_timeline = async () => {
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
  const yearScale = d3.scaleTime().domain([new Date("2020-01-01"), new Date("2021-02-20")]).range([0, lineWidth - 2]);

  // const distExtent = d3.extent(distances_per_yr_dict, d => d["max_dist"]);
  const flowExtent = [1900, 3500]
  const flowScale = d3.scaleLinear().domain(flowExtent).range([lineHeight, 0]);


  timeline.append("text")
  .attr("font-size", "20px")
  .text("February 221")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 5300)


  timeline.append("text")
  .attr("font-size", "20px")
  .text("January 2021")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 4900)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("December 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 4400)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("November 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 4000)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("October 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 3600)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("September 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 3200)

  timeline.append("text")
  .attr("font-size", "20px")
  .text("August 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 2800)


  timeline.append("text")
  .attr("font-size", "20px")
  .text("July 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 2400)

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


  timeline.append("text")
  .attr("font-size", "20px")
  .text("February 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 400)


  timeline.append("text")
  .attr("font-size", "20px")
  .text("January 2020")
  .attr("font-family", "Inter")
  .attr("fill", "white")
  .attr("x", 0)




}
vis_timeline();

