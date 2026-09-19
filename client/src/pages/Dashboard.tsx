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
  const [activeTab, setActiveTab] = useState('CONDOM');
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
      <div
        className="px-4 py-3 flex justify-between items-center border-b border-gray-700/60"
        style={{
          background: 'rgba(17,24,39,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div>
          <h1 className="text-2xl font-bold">Target Client List System</h1>
          <p className="text-gray-400 text-base">Barangay Mercado - Family Planning Services</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-base hidden sm:block">Welcome, <span className="text-white font-semibold">{username}</span></span>
          <button
            onClick={handleLogout}
            className="text-base font-bold px-3 py-1.5 rounded-lg transition"
            style={{
              background: 'rgba(239,68,68,0.52)',
              border: '1px solid rgba(239,68,68)',
              color: '#FFFF',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="px-6 overflow-x-auto border-b border-gray-700/60"
        style={{
          background: 'rgba(17,24,39,0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex gap-1 min-w-max py-2">
          {METHODS.map((method) => (
            <button
              key={method}
              onClick={() => setActiveTab(method)}
              className="flex items-center gap-2 text-sm font-medium transition"
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: activeTab === method
                  ? '1px solid rgba(99,102,241,0.45)'
                  : '1px solid transparent',
                background: activeTab === method
                  ? 'rgba(99,102,241,0.18)'
                  : 'transparent',
                color: activeTab === method ? '#a5b4fc' : 'rgba(255,255,255,0.45)',
                fontWeight: activeTab === method ? 600 : 400,
                cursor: 'pointer',
                boxShadow: activeTab === method
                  ? '0 0 12px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.06)'
                  : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {method.replace(/_/g, ' ')}
              {counts[method] > 0 && (
                <span
                  className="text-xs"
                  style={{
                    background: activeTab === method ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)',
                    color: activeTab === method ? '#e0e7ff' : 'rgba(255,255,255,0.45)',
                    borderRadius: '20px',
                    padding: '1px 8px',
                    fontWeight: 600,
                  }}
                >
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
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
            padding: '20px',
          }}
        >
          <ClientTable
            method={activeTab}
            year={selectedYear}
            onYearChange={setSelectedYear}
            onDataChange={async () => await fetchCounts()}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
