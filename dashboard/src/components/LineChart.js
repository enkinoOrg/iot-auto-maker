import React from 'react';
import { Line } from 'react-chartjs-2';

export default function LineChart({ tableData, width = 1000, height = 600 }) {
  const options = {
    animation: {
      duration: 0,
    },
  };
  return (
    <div>
      <Line data={tableData} width={width} height={height} options={options} />
    </div>
  );
}
