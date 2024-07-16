// src/StockChartTooltip.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const StockChartTooltip = ({ data }) => {
  const chartData = {
    labels: data.map(point => point.date),
    datasets: [
      {
        label: 'Stock Price',
        data: data.map(point => point.price),
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '200px', height: '100px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChartTooltip;
