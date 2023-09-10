import React from 'react';
import { Line } from 'react-chartjs-2';

export default function LineChart({ tableData }) {
  const options = {
    animation: {
      duration: 0,
    },
  };
  return (
    <div>
      <Line data={tableData} width={1000} height={600} options={options} />
    </div>
  );
}
