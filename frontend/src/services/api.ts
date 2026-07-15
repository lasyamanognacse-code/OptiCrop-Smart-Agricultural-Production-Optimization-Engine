import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export interface CropInput {
  N: number; P: number; K: number; temperature: number;
  humidity: number; ph: number; rainfall: number;
}

export interface Recommendation {
  crop: string;
  confidence: number;
  tip?: string;
}

export const recommendCrops = async (data: CropInput) => {
  const response = await axios.post(`${API_BASE}/recommend`, data);
  return response.data;
};

export const checkSuitability = async (data: CropInput & { crop_name: string }) => {
  const response = await axios.post(`${API_BASE}/suitability`, data);
  return response.data;
};
