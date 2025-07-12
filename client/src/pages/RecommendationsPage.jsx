import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Leaf,
  DollarSign,
  Clock,
  Star
} from 'lucide-react';
import { recommendationAPI } from '../utils/api';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';
import EmptyState from '../components/common/EmptyState';

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await recommendationAPI.getRecommendations();
      
      if (response.data.status === 'success') {
        setRecommendations(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error('Fetch recommendations error:', err);
      setError('Failed to load recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    try {
      setGenerating(true);
      setError('');
      
      const response = await recommendationAPI.generateRecommendations();
      
      if (response.data.status === 'success') {
        setError(''); // Clear any previous errors
        await fetchRecommendations(); // Refresh the list
        
        if (response.data.data.recommendations.length === 0) {
          setError('No new recommendations available. Please add more energy usage data to get personalized suggestions.');
        }
      }
    } catch (err) {
      console.error('Generate recommendations error:', err);
      if (err.response?.status === 404) {
        setError('Please add some energy usage data first to generate personalized recommendations.');
      } else {
        setError(err.response?.data?.message || 'Failed to generate recommendations. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const updateRecommendationStatus = async (id, status) => {
    try {
      const response = await recommendationAPI.updateRecommendationStatus(id, status);
      
      if (response.data.status === 'success') {
        setRecommendations(prev => 
          prev.map(rec => 
            rec._id === id ? { ...rec, status } : rec
          )
        );
      }
    } catch (err) {
      console.error('Update recommendation status error:', err);
      setError('Failed to update recommendation status');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'dismissed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  if (loading) {
    return <Loading message="Loading your energy recommendations..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Lightbulb className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Energy Recommendations</h1>
              <p className="text-gray-600">AI-powered suggestions to optimize your energy usage</p>
            </div>
          </div>
          <button
            onClick={generateRecommendations}
            disabled={generating}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generating...' : 'Generate New'}
          </button>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* No Recommendations State */}
      {recommendations.length === 0 && !loading && (
        <EmptyState
          icon={Lightbulb}
          title="No Recommendations Yet"
          description="Generate AI-powered recommendations based on your energy usage data to optimize efficiency and reduce costs."
          actionText="Generate Recommendations"
          onAction={generateRecommendations}
        />
      )}

      {/* Recommendations List */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div key={recommendation._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {recommendation.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {recommendation.score.toFixed(1)}/10
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {recommendation.description}
                  </p>

                  {/* Impact Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Energy Savings</p>
                        <p className="font-semibold text-blue-600">
                          {formatNumber(recommendation.impact.energySavings)} kWh
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Cost Savings</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(recommendation.impact.costSavings)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Leaf className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="text-sm text-gray-500">Carbon Reduction</p>
                        <p className="font-semibold text-emerald-600">
                          {formatNumber(recommendation.impact.carbonReduction)} kg CO₂
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {getStatusIcon(recommendation.status)}
                  <span className="text-sm text-gray-500 capitalize">
                    {recommendation.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {recommendation.status === 'pending' && (
                <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => updateRecommendationStatus(recommendation._id, 'implemented')}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Implemented
                  </button>
                  <button
                    onClick={() => updateRecommendationStatus(recommendation._id, 'dismissed')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Potential Impact Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(recommendations.reduce((sum, rec) => sum + rec.impact.energySavings, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Energy Savings (kWh)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(recommendations.reduce((sum, rec) => sum + rec.impact.costSavings, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Cost Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {formatNumber(recommendations.reduce((sum, rec) => sum + rec.impact.carbonReduction, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Carbon Reduction (kg CO₂)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;