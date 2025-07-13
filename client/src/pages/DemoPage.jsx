import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockEnergyData, mockRecommendations, mockStats } from '../utils/mockData';
import EmptyState from '../components/common/EmptyState';
import { energyAPI, recommendationAPI } from '../utils/api';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Zap, 
  TrendingUp, 
  Lightbulb, 
  DollarSign,
  Leaf,
  Plus,
  RefreshCw,
  Play,
  ArrowRight,
  BarChart3,
  Settings,
  Home,
  Sparkles,
  Activity
} from 'lucide-react';

const DemoPage = () => {
  const [energyData, setEnergyData] = useState(mockEnergyData);
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [stats, setStats] = useState(mockStats);
  const [showEmptyStates, setShowEmptyStates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  // Check API connection on load
  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        setApiConnected(true);
      }
    } catch (error) {
      setApiConnected(false);
    }
  };

  const handleToggleEmptyStates = () => {
    setShowEmptyStates(!showEmptyStates);
    if (!showEmptyStates) {
      setEnergyData([]);
      setRecommendations([]);
    } else {
      setEnergyData(mockEnergyData);
      setRecommendations(mockRecommendations);
    }
  };

  const handleGenerateRecommendations = async () => {
    setLoading(true);
    try {
      if (apiConnected) {
        // Try real API first
        const response = await recommendationAPI.generateRecommendations();
        if (response.data && response.data.data) {
          setRecommendations(response.data.data);
        } else {
          setRecommendations(mockRecommendations);
        }
      } else {
        // Use mock data
        setRecommendations(mockRecommendations);
      }
      setShowEmptyStates(false);
    } catch (error) {
      console.log('Using mock recommendations');
      setRecommendations(mockRecommendations);
    }
    setLoading(false);
  };

  const handleAddEnergyData = async () => {
    setLoading(true);
    try {
      if (apiConnected) {
        // Try to fetch real data first
        const response = await energyAPI.getEnergyUsage();
        if (response.data && response.data.data && response.data.data.energyUsage.length > 0) {
          setEnergyData(response.data.data.energyUsage);
        } else {
          setEnergyData(mockEnergyData);
        }
      } else {
        setEnergyData(mockEnergyData);
      }
      setShowEmptyStates(false);
    } catch (error) {
      console.log('Using mock energy data');
      setEnergyData(mockEnergyData);
    }
    setLoading(false);
  };

  // Process chart data
  const chartData = energyData.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    total: record.totalConsumption,
    renewable: Math.round(record.totalConsumption * record.renewablePercentage / 100),
    cost: record.totalCost
  }));

  const pieData = [
    { name: 'Renewable', value: stats.renewablePercentage, fill: '#10b981' },
    { name: 'Non-Renewable', value: 100 - stats.renewablePercentage, fill: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Renewable Energy Optimizer
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Experience the future of energy management with AI-powered insights, 
              real-time monitoring, and intelligent recommendations.
            </p>
            
            {/* Status Badges */}
            <div className="flex justify-center gap-4 mb-8">
              <div className={`px-4 py-2 rounded-full backdrop-blur-sm ${
                apiConnected ? 'bg-green-500/20 text-green-100' : 'bg-yellow-500/20 text-yellow-100'
              }`}>
                <Activity className="h-4 w-4 inline mr-2" />
                API {apiConnected ? 'Connected' : 'Demo Mode'}
              </div>
              <div className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-100 backdrop-blur-sm">
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Live Demo
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleToggleEmptyStates}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              >
                {showEmptyStates ? 'Show Live Data' : 'Show Empty States'}
              </button>
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                Access Full App <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

        {/* Stats Cards */}
        {energyData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Energy Used</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalEnergyUsed} kWh
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Renewable %</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.renewablePercentage.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalCost}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Energy Trend</p>
                  <p className="text-2xl font-bold text-gray-900">
                    +{stats.energyTrend.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        {energyData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Energy Consumption Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Consumption Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Total (kWh)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="renewable" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Renewable (kWh)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Energy Sources Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Sources</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
          </div>
          <div className="p-6">
            {recommendations.length === 0 ? (
              <EmptyState
                icon={Lightbulb}
                title="No Recommendations Yet"
                description="Add energy data to get personalized recommendations for optimizing your renewable energy usage."
                actionText="Generate Recommendations"
                onAction={handleGenerateRecommendations}
              />
            ) : (
              <div className="space-y-4">
                {recommendations.map((recommendation) => (
                  <div key={recommendation._id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {recommendation.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {recommendation.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Potential savings: ${recommendation.potentialSavings}/month
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          recommendation.priority === 'high' 
                            ? 'bg-red-100 text-red-800'
                            : recommendation.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {recommendation.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Energy Records Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Energy Records</h2>
          </div>
          <div className="p-6">
            {energyData.length === 0 ? (
              <EmptyState
                icon={Zap}
                title="No Energy Data Found"
                description="Start tracking your energy consumption to get insights and recommendations for renewable energy optimization."
                actionText="Add Energy Data"
                onAction={handleAddEnergyData}
              />
            ) : (
              <div className="overflow-x-auto -mx-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total (kWh)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Renewable %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {energyData.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.totalConsumption} kWh
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            record.renewablePercentage >= 70 
                              ? 'bg-green-100 text-green-800'
                              : record.renewablePercentage >= 50
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.renewablePercentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${record.totalCost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
