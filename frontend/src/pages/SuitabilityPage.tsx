import React, { useState } from "react";
import InputForm from "../components/InputForm";
import GaugeChart from "../components/GaugeChart";
import { checkSuitability } from "../services/api";

const SuitabilityPage: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    try {
      const resp = await checkSuitability(data);
      setResult(resp);
    } catch (e) {
      setError("Suitability check failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold text-green-800 text-center mb-2">
        🌱 Crop Suitability Check
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Check how well a specific crop matches your soil and climate conditions.
      </p>

      <InputForm onSubmit={handleSubmit} includeCropDropdown={true} />

      {loading && (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {result && !loading && (
        <div className="mt-10 p-6 bg-white rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center">
              <h2 className="text-2xl font-bold capitalize">{result.crop}</h2>
              <GaugeChart score={result.score * 100} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">
                Feature Contributions
              </h3>
              <div className="mt-2 space-y-2">
                {Object.entries(result.feature_contributions || {}).map(
                  ([feature, value]) => {
                    const val = Number(value);
                    const barWidth = Math.abs(val) * 100;
                    const isPositive = val >= 0;
                    return (
                      <div key={feature}>
                        <div className="flex justify-between text-sm">
                          <span>{feature}</span>
                          <span
                            className={
                              isPositive ? "text-green-600" : "text-red-600"
                            }
                          >
                            {isPositive ? "+" : ""}
                            {val.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${isPositive ? "bg-green-600" : "bg-red-500"}`}
                            style={{ width: `${Math.min(barWidth, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Positive values increase suitability, negative values decrease
                it.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuitabilityPage;
