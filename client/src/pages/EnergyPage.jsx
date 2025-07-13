import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { energyAPI } from '../utils/api';
import { mockEnergyData } from '../utils/mockData';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';
import EmptyState from '../components/common/EmptyState';
import { 
  Zap, 
  Plus, 
  Calendar, 
  Download,
  Trash2,
  Edit,
  Filter
} from 'lucide-react';

const EnergyPage = () => {
  const [energyData, setEnergyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    energySource: ''
  });

  useEffect(() => {
    fetchEnergyData();
  }, []);

  const fetchEnergyData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use mock data for demonstration
      console.log('Loading energy data with mock data');
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      setEnergyData(mockEnergyData);
      
    } catch (err) {
      console.error('Fetch energy data error:', err);
      setError('Failed to load energy data');
      setEnergyData(mockEnergyData); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchEnergyData();
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      energySource: ''
    });
    setTimeout(() => fetchEnergyData(), 100);
  };

  const deleteEnergyRecord = async (id) => {
    if (!confirm('Are you sure you want to delete this energy record?')) {
      return;
    }

    try {
      await energyAPI.deleteEnergyUsage(id);
      setEnergyData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Delete energy record error:', err);
      setError('Failed to delete energy record');
    }
  };

  const exportData = async () => {
    try {
      const response = await energyAPI.exportEnergyData(filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'energy-data.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export data error:', err);
      setError('Failed to export data');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSourceIcon = (source) => {
    const iconClass = "h-5 w-5";
    switch (source) {
      case 'solar':
        return <div className={`${iconClass} bg-yellow-400 rounded-full`}></div>;
      case 'wind':
        return <div className={`${iconClass} bg-blue-400 rounded-full`}></div>;
      case 'grid':
        return <div className={`${iconClass} bg-red-400 rounded-full`}></div>;
      case 'battery':
        return <div className={`${iconClass} bg-purple-400 rounded-full`}></div>;
      default:
        return <div className={`${iconClass} bg-gray-400 rounded-full`}></div>;
    }
  };

  if (loading) {
    return <Loading message="Loading energy data..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Zap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Energy Usage</h1>
              <p className="text-gray-600">Track and monitor your energy consumption</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <Link
              to="/energy/add"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Energy Data
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Energy Source
            </label>
            <select
              name="energySource"
              value={filters.energySource}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Sources</option>
              <option value="solar">Solar</option>
              <option value="wind">Wind</option>
              <option value="grid">Grid</option>
              <option value="battery">Battery</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Energy Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {energyData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage (kWh)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost ($)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carbon Footprint (kg CO₂)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {energyData.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(record.energySource)}
                        <span className="text-sm text-gray-900 capitalize">
                          {record.energySource}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.usage.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${record.cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.carbonFootprint.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteEnergyRecord(record._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Zap}
            title="No Energy Data Found"
            description="Start tracking your energy usage to get insights and recommendations."
            actionText="Add Your First Energy Record"
            actionTo="/energy/add"
          />
        )}
      </div>
    </div>
  );
};

export default EnergyPage;