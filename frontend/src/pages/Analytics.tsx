import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Scatter } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const Analytics: React.FC = () => {
  // 1) Crop distribution (bar chart)
  const cropData = {
    labels: [
      "Rice",
      "Maize",
      "Wheat",
      "Cotton",
      "Sugarcane",
      "Soybean",
      "Peanut",
    ],
    datasets: [
      {
        label: "Area (hectares)",
        data: [120, 95, 80, 60, 45, 70, 55],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(201, 203, 207, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // 2) Yield vs Rainfall (scatter)
  const scatterData = {
    datasets: [
      {
        label: "Yield (tons/ha) vs Rainfall (mm)",
        data: [
          { x: 120, y: 4.5 },
          { x: 150, y: 5.2 },
          { x: 90, y: 3.8 },
          { x: 200, y: 6.1 },
          { x: 80, y: 3.2 },
          { x: 170, y: 5.7 },
          { x: 140, y: 4.9 },
          { x: 60, y: 2.8 },
          { x: 220, y: 6.5 },
          { x: 100, y: 4.0 },
        ],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // 3) Monthly yield trend (line chart)
  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Average Yield (tons/ha)",
        data: [3.2, 3.5, 4.0, 4.5, 5.1, 5.8, 6.0, 5.7, 5.2, 4.8, 4.1, 3.6],
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3,
      },
    ],
  };

  const scatterOptions = {
    scales: {
      x: {
        type: "linear" as const,
        position: "bottom" as const,
        title: { display: true, text: "Rainfall (mm)" },
      },
      y: {
        title: { display: true, text: "Yield (tons/ha)" },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = context.raw;
            return `Rainfall: ${point.x} mm, Yield: ${point.y} tons/ha`;
          },
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-green-800 text-center mb-2">
        📊 Research Analytics
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Visual insights into crop‑environment interactions – based on aggregated
        data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            🌾 Crop Distribution by Area
          </h2>
          <Bar
            data={cropData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>

        {/* Scatter plot */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            📈 Yield vs. Rainfall
          </h2>
          <Scatter data={scatterData} options={scatterOptions} />
        </div>

        {/* Line chart – full width */}
        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            📅 Monthly Average Yield Trend
          </h2>
          <Line
            data={lineData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center text-sm text-gray-700">
        💡 These charts are based on sample data. Connect your own data sources
        via the backend API for real‑time analytics.
      </div>
    </div>
  );
};

export default Analytics;
