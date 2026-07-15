import React from "react";

const GaugeChart: React.FC<{ score: number }> = ({ score }) => {
  const angle = (score / 100) * 180;
  return (
    <div className="relative w-48 h-24 overflow-hidden">
      <div className="absolute w-full h-full bg-gray-200 rounded-t-full" />
      <div
        className="absolute w-full h-full bg-green-600 rounded-t-full origin-bottom transition-transform"
        style={{ transform: `rotate(${angle - 180}deg)` }}
      />
      <div className="absolute inset-0 flex items-center justify-center mt-12 text-xl font-bold">
        {Math.round(score)}%
      </div>
    </div>
  );
};
export default GaugeChart;
