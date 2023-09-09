import React from 'react'
import { Line } from 'react-chartjs-2'

export default function LineChart({ tableData }) {
  return (
    <div>
      <Line data={tableData} width={600} height={600} />
    </div>
  )
}