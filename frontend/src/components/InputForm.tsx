import React, { useState } from "react";

const PARAM_INFO = {
  N: {
    label: "Nitrogen (N)",
    unit: "kg/ha",
    min: 0,
    max: 300,
    desc: "Essential for leaf growth",
  },
  P: {
    label: "Phosphorus (P)",
    unit: "kg/ha",
    min: 0,
    max: 300,
    desc: "Supports root and flower development",
  },
  K: {
    label: "Potassium (K)",
    unit: "kg/ha",
    min: 0,
    max: 300,
    desc: "Improves overall plant health",
  },
  temperature: {
    label: "Temperature",
    unit: "°C",
    min: -20,
    max: 50,
    desc: "Average growing season temperature",
  },
  humidity: {
    label: "Humidity",
    unit: "%",
    min: 0,
    max: 100,
    desc: "Relative air humidity",
  },
  ph: {
    label: "pH",
    unit: "",
    min: 0,
    max: 14,
    desc: "Soil acidity/alkalinity (6–7.5 is ideal for most crops)",
  },
  rainfall: {
    label: "Rainfall",
    unit: "mm",
    min: 0,
    max: 500,
    desc: "Annual average rainfall",
  },
};

interface InputFormProps {
  onSubmit: (data: any) => void;
  includeCropDropdown?: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  includeCropDropdown,
}) => {
  const [form, setForm] = useState({
    N: 50,
    P: 50,
    K: 50,
    temperature: 25,
    humidity: 60,
    ph: 6.5,
    rainfall: 100,
    crop_name: "rice",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "crop_name" ? value : parseFloat(value) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🌾 Soil & Climate Parameters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(PARAM_INFO).map((key) => {
          const info = PARAM_INFO[key as keyof typeof PARAM_INFO];
          const val = form[key as keyof typeof form] as number;
          return (
            <div key={key} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {info.label} {info.unit && `(${info.unit})`}
                <span
                  className="ml-1 text-gray-400 cursor-help"
                  title={info.desc}
                >
                  ⓘ
                </span>
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  name={key}
                  min={info.min}
                  max={info.max}
                  step={key === "ph" ? 0.1 : 1}
                  value={val}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  name={key}
                  value={val}
                  onChange={handleChange}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                  step={key === "ph" ? 0.1 : 1}
                />
              </div>
              <div className="text-xs text-gray-400 flex justify-between">
                <span>{info.min}</span>
                <span>{info.desc}</span>
                <span>{info.max}</span>
              </div>
            </div>
          );
        })}
        {includeCropDropdown && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Crop
            </label>
            <select
              name="crop_name"
              value={form.crop_name}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
            >
              <option value="rice">🌾 Rice</option>
              <option value="maize">🌽 Maize</option>
              <option value="wheat">🌾 Wheat</option>
              <option value="cotton">🌿 Cotton</option>
              <option value="sugarcane">🌱 Sugarcane</option>
            </select>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg shadow-md transition"
        >
          Get Recommendations 🚀
        </button>
      </div>
    </form>
  );
};

export default InputForm;
