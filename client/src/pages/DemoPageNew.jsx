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
  Activity,
  Users,
  Globe
} from 'lucide-react';

const DemoPageNew = () => {
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
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
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
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section with Enhanced Design */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='9' cy='9' r='1'/%3E%3Ccircle cx='49' cy='49' r='1'/%3E%3Ccircle cx='29' cy='29' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 shadow-2xl">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-green-100">
              Renewable Energy Optimizer
            </h1>
            <p className="text-2xl text-blue-100 mb-4 max-w-4xl mx-auto font-light">
              Experience the future of energy management with AI-powered insights
            </p>
            <p className="text-lg text-blue-200 mb-12 max-w-3xl mx-auto">
              Real-time monitoring • Intelligent recommendations • Carbon footprint tracking
            </p>
            
            {/* Enhanced Status Badges */}
            <div className="flex justify-center gap-6 mb-12">
              <div className={`px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 border ${
                apiConnected ? 'bg-green-500/30 text-green-100 border-green-400/50' : 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50'
              }`}>
                <Activity className="h-5 w-5 inline mr-3" />
                {apiConnected ? 'API Connected' : 'Demo Mode Active'}
              </div>
              <div className="px-6 py-3 rounded-full bg-blue-500/30 text-blue-100 backdrop-blur-md border border-blue-400/50">
                <BarChart3 className="h-5 w-5 inline mr-3" />
                Live Interactive Demo
              </div>
              <div className="px-6 py-3 rounded-full bg-purple-500/30 text-purple-100 backdrop-blur-md border border-purple-400/50">
                <Users className="h-5 w-5 inline mr-3" />
                Multi-User Platform
              </div>
            </div>

            {/* Enhanced Control Buttons */}
            <div className="flex justify-center gap-6 flex-wrap">
              <button
                onClick={handleToggleEmptyStates}
                disabled={loading}
                className="px-8 py-4 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none border border-white/30 shadow-lg"
              >
                {loading ? (
                  <RefreshCw className="h-5 w-5 animate-spin inline mr-3" />
                ) : (
                  <Play className="h-5 w-5 inline mr-3" />
                )}
                {showEmptyStates ? 'Show Live Data' : 'Show Empty States'}
              </button>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-lg font-semibold"
              >
                Access Full Platform <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-lg font-semibold"
              >
                Start Free Trial <Sparkles className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        
        {/* Stats Cards with Enhanced Design */}
        {energyData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Energy Used</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {stats.totalEnergyUsed}<span className="text-xl text-gray-500 font-normal"> kWh</span>
                  </p>
                  <p className="text-sm text-green-600 mt-2 font-medium">↗ +5.2% from last month</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Renewable Energy</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">
                    {stats.renewablePercentage.toFixed(1)}<span className="text-xl font-normal">%</span>
                  </p>
                  <p className="text-sm text-green-600 mt-2 font-medium">🎯 Target: 85%</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Cost</p>
                  <p className="text-4xl font-bold text-yellow-600 mt-2">
                    ${stats.totalCost}
                  </p>
                  <p className="text-sm text-green-600 mt-2 font-medium">💰 $45 saved this month</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Energy Trend</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">
                    +{stats.energyTrend.toFixed(1)}<span className="text-xl font-normal">%</span>
                  </p>
                  <p className="text-sm text-purple-600 mt-2 font-medium">📈 Optimized usage</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section with Enhanced Design */}
        {energyData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Energy Consumption Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                Energy Consumption Trend
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorRenewable" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} fontWeight={500} />
                  <YAxis stroke="#6b7280" fontSize={12} fontWeight={500} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none', 
                      borderRadius: '16px', 
                      boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                      padding: '16px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    strokeWidth={4}
                    name="Total (kWh)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="renewable" 
                    stroke="#10b981" 
                    fillOpacity={1}
                    fill="url(#colorRenewable)"
                    strokeWidth={4}
                    name="Renewable (kWh)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Energy Sources Distribution */}
            <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                Energy Sources
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    innerRadius={80}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={6}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none', 
                      borderRadius: '16px', 
                      boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                      padding: '16px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recommendations Section with Enhanced Design */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-10 py-8 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white">
            <h2 className="text-3xl font-bold flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Lightbulb className="h-8 w-8" />
              </div>
              AI-Powered Recommendations
            </h2>
            <p className="text-purple-100 mt-3 text-lg">Smart insights to optimize your energy consumption and reduce costs</p>
          </div>
          <div className="p-10">
            {recommendations.length === 0 ? (
              <EmptyState
                icon={Lightbulb}
                title="No Recommendations Yet"
                description="Our AI is ready to analyze your energy data and provide personalized recommendations for optimization."
                actionText="Generate AI Recommendations"
                onAction={handleGenerateRecommendations}
                loading={loading}
              />
            ) : (
              <div className="space-y-8">
                {recommendations.map((recommendation, index) => (
                  <div key={recommendation._id} className="flex items-start space-x-6 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex-shrink-0">
                      <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
                        <Lightbulb className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-2xl font-bold text-gray-900">
                          {recommendation.title}
                        </h4>
                        <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                          recommendation.priority === 'high' 
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : recommendation.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {recommendation.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Potential Savings</p>
                              <p className="text-2xl font-bold text-green-600">${recommendation.potentialSavings}/month</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <TrendingUp className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Impact Score</p>
                              <p className="text-2xl font-bold text-blue-600">8.{index + 5}/10</p>
                            </div>
                          </div>
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Energy Records Table with Enhanced Design */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-10 py-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
            <h2 className="text-3xl font-bold flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
              Energy Usage Records
            </h2>
            <p className="text-blue-100 mt-3 text-lg">Detailed tracking of your energy consumption patterns</p>
          </div>
          <div className="p-10">
            {energyData.length === 0 ? (
              <EmptyState
                icon={Zap}
                title="No Energy Data Found"
                description="Start tracking your energy consumption to gain insights and optimize your renewable energy usage."
                actionText="Add Energy Data"
                onAction={handleAddEnergyData}
                loading={loading}
              />
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Total Consumption
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Renewable Energy
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {energyData.map((record, index) => (
                        <tr key={record._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                          <td className="px-8 py-6 whitespace-nowrap text-base font-semibold text-gray-900">
                            {new Date(record.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Zap className="h-5 w-5 text-blue-600" />
                              </div>
                              <span className="font-semibold">{record.totalConsumption} kWh</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                              record.renewablePercentage >= 70 
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : record.renewablePercentage >= 50
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              <Leaf className="h-4 w-4 mr-2" />
                              {record.renewablePercentage}%
                            </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="h-5 w-5 text-green-600" />
                              </div>
                              <span className="font-semibold">${record.totalCost}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action with Enhanced Design */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl shadow-2xl p-12 text-white text-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='9' cy='9' r='1'/%3E%3Ccircle cx='49' cy='49' r='1'/%3E%3Ccircle cx='29' cy='29' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
          
          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="h-12 w-12" />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-6">Ready to Optimize Your Energy Usage?</h3>
            <p className="text-blue-100 mb-10 max-w-3xl mx-auto text-xl leading-relaxed">
              Join thousands of businesses already saving money and reducing their carbon footprint with our AI-powered energy optimization platform.
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <Link
                to="/register"
                className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                🚀 Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-10 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg border-2 border-white/20"
              >
                💼 Sign In to Continue
              </Link>
              <a
                href="#demo"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                📊 Explore More Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPageNew;
