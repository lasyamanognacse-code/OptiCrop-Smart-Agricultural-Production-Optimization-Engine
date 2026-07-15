import React from "react";
import { Recommendation } from "../services/api";

// You can expand this object with real data
const CROP_META: Record<
  string,
  { icon: string; season: string; water: string }
> = {
  rice: { icon: "🌾", season: "Kharif (Jun–Oct)", water: "High (flooded)" },
  maize: { icon: "🌽", season: "Both Kharif & Rabi", water: "Medium" },
  wheat: { icon: "🌾", season: "Rabi (Nov–Apr)", water: "Medium" },
  cotton: { icon: "🌿", season: "Kharif (Jun–Oct)", water: "Low–Medium" },
  sugarcane: { icon: "🌱", season: "Tropical", water: "High" },
  soybean: { icon: "🫘", season: "Kharif", water: "Medium" },
  peanut: { icon: "🥜", season: "Kharif", water: "Low" },
};

interface Props {
  rec: Recommendation;
}

const ResultCard: React.FC<Props> = ({ rec }) => {
  const meta = CROP_META[rec.crop] || {
    icon: "🌱",
    season: "N/A",
    water: "N/A",
  };
  return (
    <div className="border rounded-xl p-5 shadow-md hover:shadow-lg transition bg-white">
      <div className="flex items-center gap-2">
        <span className="text-3xl">{meta.icon}</span>
        <h3 className="text-xl font-bold capitalize">{rec.crop}</h3>
      </div>
      <div className="mt-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Confidence</span>
          <span>{(rec.confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${rec.confidence * 100}%` }}
          />
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-medium">Season:</span> {meta.season}
        </p>
        <p>
          <span className="font-medium">Water need:</span> {meta.water}
        </p>
        {rec.tip && <p className="text-green-700">💡 {rec.tip}</p>}
      </div>
    </div>
  );
};

export default ResultCard;
