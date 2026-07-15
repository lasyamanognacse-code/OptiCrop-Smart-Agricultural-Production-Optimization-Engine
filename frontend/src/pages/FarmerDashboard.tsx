import React, { useState } from "react";
import InputForm from "../components/InputForm";
import ResultCard from "../components/ResultCard";
import { recommendCrops, Recommendation } from "../services/api";

const FarmerDashboard: React.FC = () => {
  const [results, setResults] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    try {
      const resp = await recommendCrops(data);
      setResults(resp.recommendations);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          🌿 OptiCrop – Smart Farming Assistant
        </h1>
        <p className="text-gray-600 mt-1">
          Enter your soil and climate data to get the best crop recommendations.
        </p>
      </div>

      <InputForm onSubmit={handleSubmit} />

      {loading && (
        <div className="mt-8 flex justify-center">
          <div className="animate-pulse flex space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            📊 Recommended Crops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((rec, i) => (
              <ResultCard key={i} rec={rec} />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            The recommendations are based on machine learning analysis of your
            inputs.
          </p>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
