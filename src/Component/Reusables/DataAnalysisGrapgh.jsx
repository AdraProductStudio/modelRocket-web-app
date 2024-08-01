import React from "react";
import { Chart } from "react-google-charts";

export function DataAnalysisGrapgh({ graphData }) {
  const data = Object.entries(graphData).map(([key, value]) => [
    key,
    value,
    "#65a3ff",
  ]);
  const options = {
    legend: "none",
    hAxis: { 
      textPosition:"none",
      textStyle: {
        fontSize: 12, // Adjust as needed
      },
      slantedText: true, // This will rotate the text
      slantedTextAngle: 45, // Adjust the angle as needed
      minValue: 1
    },
    chartArea: {
      top: 7,
      bottom: 70, // Increase this value if labels are cut off
      width: "50%", // Ensure the entire width is used
    },
    tooltip: {
      isHtml: true,
    }
  };

  data.unshift(["Element", "Consumer Weight", { role: "style" }]);

  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height="20rem"
      data={data}
      options={options}
    />
  );
}
