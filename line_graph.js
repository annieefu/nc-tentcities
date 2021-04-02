// javascript for the average distance line graph 

// INSPIRATION CREDIT TO THE LINE GRAPH DEMO BY JEFF RZ IN INFO 3300 
// https://jeffrz.github.io/info3300-spr2020/notes/20.02.26.notes.htm 

// Distance Traveled Chart
const lgsvg = d3.select("#line_graph_svg");
const width2 = lgsvg.attr("width");
const height2 = lgsvg.attr("height");
const margin = { top: 130, right: 130, bottom: 130, left: 130 };
const lgWidth = width2 - margin.left - margin.right;
const lgHeight = height2 - margin.top - margin.bottom;
const annotations = lgsvg.append("g").attr("id", "gridlines");
let lllinechart = lgsvg.append("g").attr("id", "graphs")
  .attr("transform", "translate(" + (margin.left + 10) + "," + margin.top + ")");

const vis_line = async () => {
  let line_data = await d3.csv("inflow-outflow.csv");

  // change all dates from strings to d3 datetime objects
  let date_parser = d3.timeParse("%Y-%m-%d")
  lat_long_data.forEach(d => {
    d["date"] = date_parser(d["date"])
    d["year"] = d["date"].getFullYear();
  });

  console.log(lat_long_data);
  console.log(lat_long_data[0]["latitude_mean"])

  // returns list of dictionaries containing the minimum and maximum array points
  function find_yr_max_mins(data) {

    // does all calculations for one year
    function for_a_yr(yr) {

      // function to filter by a year
      function yr_filter(obj) {
        return obj["year"] == yr
      }

      // returns distance between two different days lat and long
      // used haversine formula to transform distances to miles 
      // code example taken from https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript 
      function dist(p1, p2) {
        function toRad(x) {
          return x * Math.PI / 180;
        }

        y0 = p1["latitude_mean"] - p2["latitude_mean"]
        x0 = p1["longitude_mean"] - p2["longitude_mean"]
        dlat = toRad(y0);
        dlon = toRad(x0);
        a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(toRad(p1["latitude_mean"])) * Math.cos(toRad(p2["latitude_mean"])) * Math.sin(dlon / 2) * Math.sin(dlon / 2)
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = 3961 * c
        return d
      }

      var yr_data = data.filter(yr_filter);

      // code inspired from https://www.geeksforgeeks.org/maximum-distance-between-two-points-in-coordinate-plane-using-rotating-calipers-method/
      function max_dist(yr_data) {
        let n = yr_data.length;
        var maxm = 0;
        var max_pt = 0;
        var min_pt = 0;
        var dist_list = [];

        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            let poss = dist(yr_data[i], yr_data[j]);
            dist_list.push(poss);
            if (poss > maxm) {
              var maxm = poss;
              if (yr_data[i]["latitide_mean"] > yr_data[j]["latitide_mean"]) {
                var min_pt = yr_data[j];
                var max_pt = yr_data[i];
              } else {
                var min_pt = yr_data[i];
                var max_pt = yr_data[j];
              }
            }
          }
        }
        var dist_list = dist_list.sort(d3.ascending);
        var lower = d3.quantile(dist_list, 0.993);
        var guess = d3.quantile(dist_list, 0.996);
        var upper = d3.quantile(dist_list, 0.999);
        return {
          "year": yr, "max_pt": max_pt, "min_pt": min_pt, "max_dist": maxm,
          "lower_guess": lower, "guess": guess, "upper_guess": upper
        }
      }
      let big_dist = max_dist(yr_data);
      return big_dist;
    }
    let yr_max_and_mins = [];
    for (y = 1990; y < 2021; y++) {
      yr_max_and_mins.push(for_a_yr(y));
    }
    return yr_max_and_mins
  }

  // list of dictionaries containing the minimum and maximum array points
  let distances_per_yr_dict = find_yr_max_mins(lat_long_data);
  let yr_avg_temps = await d3.csv("yr_avg_temp.csv");

  const yearTimeParser = d3.timeParse('%Y');
  distances_per_yr_dict.forEach(d => {
    d["YearDate"] = yearTimeParser(d["year"])
  });

  console.log(distances_per_yr_dict);

  yr_avg_temps.forEach(d => {
    let st = d["Date"]
    // console.log(st);
    let subst = st.substring(0, 4)
    d["YearDate"] = yearTimeParser(subst)
    d["Value"] = Number(d["Value"])
  })
  console.log(yr_avg_temps);

  const yearExtent = d3.extent(distances_per_yr_dict, d => d["YearDate"]);
  const yearScale = d3.scaleTime().domain(yearExtent).range([0, llWidth]);

  // const distExtent = d3.extent(distances_per_yr_dict, d => d["max_dist"]);
  const distExtent = [1900, 2800]
  const distScale = d3.scaleLinear().domain(distExtent).range([llHeight, 0]);

  const tempExtent = d3.extent(yr_avg_temps, d => d.Value)
  const tempScale = d3.scaleLinear().domain(tempExtent).range([llHeight, 0]);

  let leftAxis = d3.axisLeft(distScale)
  let leftGridlines = d3.axisLeft(distScale)
    .tickSize(-llWidth - 10)
    .tickFormat("")

  annotations.append("g")
    .attr("class", "y1 axis")
    .attr("fill", "#EAE0D5")
    .attr("transform", "translate(" + (margin.left + 10) + "," + margin.top + ")")
    .attr("fill", "#EAE0D5")
    .attr("stroke", "#EAE0D5")
    // .attr("opacity", ".7")
    .call(leftAxis)

  annotations.append("g")
    .attr("class", "y1 gridlines")
    .attr("fill", "#EAE0D5")
    .attr("opacity", 0.45)
    .attr("transform", "translate(" + (margin.left + 10) + "," + margin.top + ")")
    .call(leftGridlines)

  annotations.append("text")
    .attr("transform", "translate(" + (80) + "," + (height2 / 2) + ")rotate(-90)")
    // .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .attr("stroke", "#EAE0D5")
    .attr("fill", "#EAE0D5")
    .text("Distance Traveled")

  let rightAxis = d3.axisRight(tempScale)

  annotations.append("g")
    .attr("class", "y2axis")
    // .style("fill", "white")
    .attr("stroke", "#EAE0D5")
    .attr("transform", "translate(" + (margin.left + 10 + llWidth) + "," + margin.top + ")")
    .call(rightAxis)

  annotations.append("text")
    .attr("transform", "translate(" + (llWidth + 200) + "," + (height2 / 2) + ")rotate(-90)")
    // .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .attr("stroke", "#EAE0D5")
    .text("Annual Average Temperature")
    .attr("fill", "#EAE0D5")

  let bottomAxis = d3.axisBottom(yearScale)
  let bottomGridlines = d3.axisBottom(yearScale)
    .tickSize(-llHeight - 10)
    .tickFormat("")

  annotations.append("g")
    .attr("class", "x axis")
    .attr("fill", "#EAE0D5")
    .attr("stroke", "#EAE0D5")
    .attr("transform", "translate(" + (margin.left + 10) + "," + (llHeight + margin.top) + ")")
    .call(bottomAxis)

  annotations.append("g")
    .attr("class", "x gridlines")
    .attr("fill", "#5E503F")
    .attr("stroke", "#5E503F")
    .attr("opacity", .45)
    // .attr("stroke", "white")
    .attr("transform", "translate(" + (margin.left + 10) + "," + (llHeight + margin.top) + ")")
    .call(bottomGridlines)

  annotations.append("text")
    .attr("transform", "translate(" + (llWidth / 2 + margin.left + 22) + "," + (llHeight + margin.top + 50) + ")")
    .style("text-anchor", "middle")
    .attr("fill", "#EAE0D5")
    .attr("stroke", "#EAE0D5")
    .text("Year")


  annotations.append("text")
  .attr("transform", "translate(" + (llWidth / 2 + margin.left + 22) + "," + (llHeight - 250) + ")")
  .style("text-anchor", "middle")
  .attr("fill", "#EAE0D5")
  .attr("font-size", "22px")
  .attr("stroke", "#EAE0D5")
  .text("Wood Thrush Population Density over Time")

  var lineGenerDist = d3.line()
    .x(d => yearScale(d["YearDate"]))
    .y(d => distScale(d["guess"]))
    .curve(d3.curveMonotoneX);

  var lineGenerTemp = d3.line()
    .x(d => yearScale(d["YearDate"]))
    .y(d => tempScale(d["Value"]));

  let linearRegression = d3.regressionLinear()
    .x(d => d.YearDate)
    .y(d => d.Value);

  // confidence band 
  lllinechart.append("path").datum(distances_per_yr_dict)
    // .attr("fill", "#EAE0D5")
    .attr("fill", "#C6AC8F")
    .attr("opacity", 0.55)
    .attr("stroke", "none")
    .attr("d", d3.area().curve(d3.curveMonotoneX)
      .x(function (d) { return yearScale(d["YearDate"]) })
      .y0(function (d) { return distScale(d["lower_guess"]) })
      .y1(function (d) { return distScale(d["upper_guess"]) })
    )

  // line chart temp 
  lllinechart.append("line").datum(linearRegression(yr_avg_temps))
    .attr("x1", d => yearScale(d[0][0]))
    .attr("x2", d => yearScale(d[1][0]))
    .attr("y1", d => tempScale(d[0][1]))
    .attr("y2", d => tempScale(d[1][1]))
    .attr("class", "line")
    .attr("data-legend", "Average Annual Temperature")
    .attr("stroke", "#832232")
    // .attr("stroke", "#ab293f")
    .style("stroke-dasharray", ("12, 12"))
    .attr("stroke-width", 3)
    .attr("opacity", 1);

  console.log(linearRegression)

  // line chart dist
  lllinechart.append("path").datum(distances_per_yr_dict)
    .attr("class", "line")
    .attr("data-legend", "Migratory Distance")
    .attr("fill", "none")
    .attr("stroke", "#EAE0D5")
    // .attr("stroke", "#C6AC8F")
    .attr("stroke-width", 2)
    .attr("opacity", 1)
    .attr("d", lineGenerDist);

  lllinechart.selectAll("circle").data(distances_per_yr_dict)
    .join("circle")
    .attr("r", 3)
    .attr("fill", "#EAE0D5")
    .attr("cx", d => yearScale(d["YearDate"]))
    .attr("cy", d => distScale(d["guess"]))

  let llmouseGroup = lllinechart.append("g");
  let valuemark = llmouseGroup.append("circle")
    .attr("id", "value")
    .attr("fill", "none")
    .attr("stroke", "#eae0d5")
    .attr("stroke-width", 2)
    .attr("r", 10)
    .attr("opacity", 0);

  let dist_label = llmouseGroup.append("text")
    .attr("id", "label")
    .attr("stroke", "#eae0d5")
    .attr("fill", "#eae0d5")
    .attr("opacity", 0);

  let dist_label2 = llmouseGroup.append("text")
    .attr("id", "label2")
    .attr("stroke", "#eae0d5")
    .attr("fill", "#eae0d5")
    .attr("opacity", 0);

  let active = llmouseGroup.append("rect")
    .attr("id", "active")
    .attr("width", llWidth)
    .attr("height", llHeight)
    .attr("fill", "none")
    .attr("pointer-events", "all");

  let find_closest_x = d3.bisector(d => d.YearDate).right;

  active.on("mouseover", function () {
    valuemark.attr("opacity", 1);
    dist_label.attr("opacity", 1);
    dist_label2.attr("opacity", 1);
  });

  active.on("mouseout", function () {
    // Hide them when mousing out of chart
    valuemark.attr("opacity", 0);
    dist_label.attr("opacity", 0);
    dist_label2.attr("opacity", 0);

  });

  active.on("mousemove", function () {
    let mouse_loc = d3.mouse(this);
    let x = mouse_loc[0];
    let xyear = yearScale.invert(x);
    let i = find_closest_x(distances_per_yr_dict, xyear);
    let d = distances_per_yr_dict[i];

    let i2 = find_closest_x(yr_avg_temps, xyear);
    let d2 = yr_avg_temps[i];

    let xPos = yearScale(d['YearDate']);
    let yPos = distScale(d["guess"]);
    valuemark.attr("cx", xPos).attr("cy", yPos);

    let txt2 = Math.round(d["guess"]) + " mi"
    let txt = "Avg Temp: " + d2['Value'] + " °F"

    dist_label.text(txt);
    if (xPos < llWidth / 2.0) {
      dist_label.attr("x", xPos + 4).attr("y", yPos - 15).attr("text-anchor", "start");
    }
    else {
      dist_label.attr("x", xPos + 4).attr("y", yPos - 15).attr("text-anchor", "start");
    }

    dist_label2.text(txt2);
    if (xPos < llWidth / 2.0) {
      dist_label2.attr("x", xPos + 4).attr("y", yPos - 33).attr("text-anchor", "start");
    }
    else {
      dist_label2.attr("x", xPos + 4).attr("y", yPos - 33).attr("text-anchor", "start");
    }
  });

  // legend 
  var lllegendwidth = 200;
  var lllegendheight = 50;
  var lllegend = lllinechart.append('rect')
    .attr('width', lllegendwidth)
    .attr('height', lllegendheight)
    .attr('fill', "#eae0d5")
    .attr('opacity', 0.55)
    .attr('class', 'latlonglegend')
    .attr("transform", "translate(" + (llWidth - lllegendwidth - 10) + "," + 10 + ")")

  let lllegend_distancetext = lllinechart.append("text")
    .attr('color', '#832232')
    .attr("transform", "translate(" + (llWidth - lllegendwidth - 5) + "," + 30 + ")")
    .text("Distance (mi)")

  let lllegend_distanceline = lllinechart.append("line")
    .attr('color', '#832232')
    .attr("transform", "translate(" + (llWidth - lllegendwidth + 100) + "," + 23 + ")")
    .attr("x1", 0)
    .attr("x2", 70)
    .attr("y1", 5)
    .attr("y2", 5)
    .attr("class", "line")
    .attr("stroke", "#EAE0D5")
    .attr("stroke-width", 2)
    .attr("opacity", 1)

  let lllegend_temptext = lllinechart.append("text")
    .attr('color', '#832232')
    .attr("transform", "translate(" + (llWidth - lllegendwidth - 5) + "," + 50 + ")")
    .text("Temperature")

  let lllegend_templine = lllinechart.append("line")
    .attr('color', '#832232')
    .attr("transform", "translate(" + (llWidth - lllegendwidth + 100) + "," + 43 + ")")
    .attr("x1", 0)
    .attr("x2", 70)
    .attr("y1", 5)
    .attr("y2", 5)
    .attr("class", "line")
    .attr("stroke", "#832232")
    .style("stroke-dasharray", ("12, 12"))
    .attr("stroke-width", 3)
    .attr("opacity", 1);
}
vis_avg_lat_long();

