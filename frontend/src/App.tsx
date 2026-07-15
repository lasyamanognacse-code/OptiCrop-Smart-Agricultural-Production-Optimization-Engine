import React, { useState } from 'react';
import FarmerDashboard from './pages/FarmerDashboard';
import SuitabilityPage from './pages/SuitabilityPage';  // we'll create this or rename ResearcherPanel
import Analytics from './pages/Analytics';

type Tab = 'farmer' | 'suitability' | 'analytics';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('farmer');

  const renderPage = () => {
    switch (activeTab) {
      case 'farmer':
        return <FarmerDashboard />;
      case 'suitability':
        return <SuitabilityPage />;
      case 'analytics':
        return <Analytics />;
      default:
        return <FarmerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-green-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>🌿</span> OptiCrop
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('farmer')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'farmer'
                  ? 'bg-white text-green-700 font-semibold'
                  : 'hover:bg-green-600'
              }`}
            >
              🌾 Farmer Dashboard
            </button>
            <button
              onClick={() => setActiveTab('suitability')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'suitability'
                  ? 'bg-white text-green-700 font-semibold'
                  : 'hover:bg-green-600'
              }`}
            >
              🔬 Suitability Check
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'analytics'
                  ? 'bg-white text-green-700 font-semibold'
                  : 'hover:bg-green-600'
              }`}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-sm text-gray-600">
        <p>🌱 OptiCrop – Smart Agricultural Production Optimization Engine</p>
        <p className="text-xs">Powered by AI &amp; ML | Data-driven crop recommendations</p>
      </footer>
    </div>
  );
}

export default App;