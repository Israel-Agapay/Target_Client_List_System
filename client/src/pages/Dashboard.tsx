import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClientTable from '../components/ClientTable';
import API from '../services/api';

const METHODS = [
  'CONDOM', 'DMPA', 'FP_BTL', 'FP_SDM', 'IMPLANT',
  'IUD', 'PILLS_BUYING', 'PILLS_COC', 'PILLS_POP'
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('PILLS_BUYING');
  const currentYear = new Date().getFullYear();
  const YEARS = [0, currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const [selectedYear, setSelectedYear] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const fetchCounts = async () => {
    try {
      const res = await API.get(`/clients/counts/all?year=${selectedYear}`);
      setCounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [selectedYear]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Target Client List System</h1>
          <p className="text-gray-400 text-base">Barangay Mercado - Family Planning Services</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-base hidden sm:block">Welcome, <span className="text-white font-semibold">{username}</span></span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-base transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {METHODS.map((method) => (
            <button
              key={method}
              onClick={() => setActiveTab(method)}
              className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
                activeTab === method
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {method.replace(/_/g, ' ')}
              {counts[method] > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === method ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {counts[method]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          {activeTab.replace(/_/g, ' ')} Clients — {selectedYear === 0 ? new Date().getFullYear() : selectedYear}
        </h2>
        <ClientTable
          method={activeTab}
          year={selectedYear}
          onYearChange={setSelectedYear}
          onDataChange={async () => await fetchCounts()}
        />
      </div>
    </div>
  );
};

export default Dashboard;