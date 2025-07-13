import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { energyAPI, recommendationAPI, usersAPI } from '../utils/api';
import { mockEnergyData, mockRecommendations, mockStats } from '../utils/mockData';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';
import EmptyState from '../components/common/EmptyState';
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
  Cell
} from 'recharts';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  Plus,
  Users,
  DollarSign
} from 'lucide-react';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [energyData, setEnergyData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Always use mock data for demonstration purposes
        console.log('Loading dashboard with mock data for demonstration');
        
        // Use mock data directly
        setEnergyData(mockEnergyData);
        setRecommendations(mockRecommendations);
        setStats(mockStats);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setAlert({
          type: 'error',
          message: 'Failed to load dashboard data. Please try again.'
        });
        // Set mock data as fallback
        setEnergyData(mockEnergyData);
        setRecommendations(mockRecommendations);
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Process data for charts
  const chartData = energyData.map((record, index) => ({
    name: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total: record.totalConsumption || 0,
    renewable: (record.totalConsumption || 0) * (record.renewablePercentage || 0) / 100,
    cost: record.totalCost || 0
  })).slice(-7); // Show last 7 records

  const pieChartData = energyData.length > 0 ? (() => {
    const totalRenewable = energyData.reduce((sum, record) => 
      sum + ((record.totalConsumption || 0) * (record.renewablePercentage || 0) / 100), 0);
    const totalNonRenewable = energyData.reduce((sum, record) => 
      sum + ((record.totalConsumption || 0) * (100 - (record.renewablePercentage || 0)) / 100), 0);
    
    return [
      { name: 'Renewable', value: totalRenewable, fill: '#10b981' },
      { name: 'Non-Renewable', value: totalNonRenewable, fill: '#ef4444' }
    ].filter(item => item.value > 0);
  })() : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading message="Loading dashboard..." />
      </div>
    );
  }

  const energySourceColors = {
    solar: '#f59e0b',
    wind: '#10b981',
    grid: '#ef4444',
    battery: '#8b5cf6'
  };

  return (
    <div className="space-y-6">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's your energy usage overview and recommendations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Energy Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalEnergyUsed?.toFixed(1) || '0.0'} kWh
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {stats?.energyTrend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm ${stats?.energyTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(stats?.energyTrend || 0).toFixed(1)}% from last month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Renewable %</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.renewablePercentage?.toFixed(1) || '0.0'}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              Goal: 80% renewable energy
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats?.costSavings?.toFixed(0) || '0'}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              This month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Recommendations</p>
              <p className="text-2xl font-bold text-gray-900">
                {recommendations.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Lightbulb className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/recommendations"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all →
            </Link>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalUsers || '0'}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/admin/users"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Manage users →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Usage Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Energy Usage Trend</h3>
            <Link 
              to="/energy"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View details →
            </Link>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
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
          ) : (
            <EmptyState
              icon={Zap}
              title="No Energy Data Available"
              description="Start tracking your energy usage to see consumption trends and patterns"
              actionText="Add Energy Data"
              actionTo="/energy/add"
            />
          )}
        </div>

        {/* Energy Sources Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Sources</h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No energy source data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Recommendations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Recommendations</h3>
            <Link 
              to="/recommendations"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all →
            </Link>
          </div>
        </div>
        <div className="p-6">
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((recommendation) => (
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
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No recommendations available</p>
              <p className="text-sm text-gray-400 mt-1">
                Add some energy data to get personalized recommendations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;