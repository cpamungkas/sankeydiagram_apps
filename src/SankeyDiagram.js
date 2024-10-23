import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal, sankeyLeft } from "d3-sankey";

const SankeyDiagram = () => {
  const svgRef = useRef();

  useEffect(() => {
    const data = {
      nodes: [
        { name: "Wages" },
        { name: "Other" },
        { name: "Budget" },
        { name: "Taxes" },
        { name: "Housing" },
        { name: "Food" },
        { name: "Transportation" },
        { name: "Other Necessities" },
        { name: "Savings" }
      ],
      links: [
        { source: 0, target: 2, value: 1500 },
        { source: 1, target: 2, value: 250 },
        { source: 2, target: 3, value: 450 },
        { source: 2, target: 4, value: 420 },
        { source: 2, target: 5, value: 400 },
        { source: 2, target: 6, value: 295 },
        { source: 2, target: 7, value: 35 },
        { source: 2, target: 8, value: 150 }
      ]
    };

    const width = 700;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Tooltip buat hover info
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("padding", "8px")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("box-shadow", "0 2px 10px rgba(0, 0, 0, 0.1)");

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const { nodes, links } = sankey()
      .nodeAlign(sankeyLeft)
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]])(data);

    // Nodes (kotak) dengan warna beda-beda
    svg.append("g")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", (d, i) => colorScale(i))  // Kasih warna beda tiap node
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
          .text(`${d.name}: ${d.value}`);
        d3.select(event.currentTarget).attr("fill", d3.rgb(colorScale(d.index)).darker(2));
      })
      .on("mousemove", (event) => {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", (event, d) => {
        tooltip.style("visibility", "hidden");
        d3.select(event.currentTarget).attr("fill", colorScale(d.index)); // Balikin warna asal
      });

    // Links (garis penghubung) dengan warna beda-beda
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.2)
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d, i) => colorScale(i))  // Kasih warna beda tiap link
      .attr("stroke-width", d => Math.max(1, d.width))
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
          .text(`${d.source.name} → ${d.target.name}: ${d.value}`);
        d3.select(event.currentTarget).attr("stroke-opacity", 0.6);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", (event) => {
        tooltip.style("visibility", "hidden");
        d3.select(event.currentTarget).attr("stroke-opacity", 0.2);
      });
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default SankeyDiagram;
