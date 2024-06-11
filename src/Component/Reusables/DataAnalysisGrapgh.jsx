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
  };

  data.unshift(["Element", "Consumer Weight", { role: "style" }]);
  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}
