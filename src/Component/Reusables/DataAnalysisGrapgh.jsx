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
      textPosition: 'none' // This hides the x-axis labels
    },
  }

  data.unshift(["Element", "Consumer Weight", { role: "style" }]);
  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height="200px"
      data={data}
      options={options}
    />
  );
}
