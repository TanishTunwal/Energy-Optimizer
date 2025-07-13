import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { energyAPI } from '../utils/api';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';
import { Zap, Save, ArrowLeft } from 'lucide-react';

const AddEnergyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    totalConsumption: '',
    totalCost: '',
    renewableConsumption: '',
    renewableCost: '',
    nonRenewableConsumption: '',
    nonRenewableCost: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const renewableConsumption = parseFloat(formData.renewableConsumption) || 0;
      const nonRenewableConsumption = parseFloat(formData.nonRenewableConsumption) || 0;
      const totalConsumption = parseFloat(formData.totalConsumption) || (renewableConsumption + nonRenewableConsumption);
      const totalCost = parseFloat(formData.totalCost);
      
      // Client-side validation
      if (!formData.date) {
        setAlert({
          type: 'error',
          message: 'Please select a date'
        });
        setLoading(false);
        return;
      }

      if (totalConsumption <= 0) {
        setAlert({
          type: 'error',
          message: 'Total consumption must be greater than 0'
        });
        setLoading(false);
        return;
      }

      if (isNaN(totalCost) || totalCost < 0) {
        setAlert({
          type: 'error',
          message: 'Please enter a valid total cost'
        });
        setLoading(false);
        return;
      }
      
      const data = {
        date: formData.date,
        totalConsumption,
        totalCost,
        energyData: {
          renewable: {
            solar: {
              consumption: renewableConsumption,
              cost: parseFloat(formData.renewableCost) || 0
            }
          },
          nonRenewable: {
            grid: {
              consumption: nonRenewableConsumption,
              cost: parseFloat(formData.nonRenewableCost) || 0
            }
          }
        },
        renewablePercentage: totalConsumption > 0 ? Math.round((renewableConsumption / totalConsumption) * 100) : 0,
        notes: formData.notes
      };

      const response = await energyAPI.createEnergyUsage(data);
      
      if (response.data.status === 'success') {
        setAlert({
          type: 'success',
          message: 'Energy data added successfully!'
        });
        setTimeout(() => {
          navigate('/energy');
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding energy data:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add energy data. Please check your input and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Add Energy Usage</h1>
                  <p className="text-gray-600">Record your energy consumption data</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/energy')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {alert && (
              <div className="mb-6">
                <Alert type={alert.type} message={alert.message} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="totalConsumption" className="block text-sm font-medium text-gray-700 mb-2">
                    Total Consumption (kWh)
                  </label>
                  <input
                    type="number"
                    id="totalConsumption"
                    name="totalConsumption"
                    step="0.01"
                    min="0"
                    required
                    value={formData.totalConsumption}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700 mb-2">
                    Total Cost ($)
                  </label>
                  <input
                    type="number"
                    id="totalCost"
                    name="totalCost"
                    step="0.01"
                    min="0"
                    required
                    value={formData.totalCost}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Energy Breakdown (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="renewableConsumption" className="block text-sm font-medium text-gray-700 mb-2">
                      Renewable Consumption (kWh)
                    </label>
                    <input
                      type="number"
                      id="renewableConsumption"
                      name="renewableConsumption"
                      step="0.01"
                      min="0"
                      value={formData.renewableConsumption}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="renewableCost" className="block text-sm font-medium text-gray-700 mb-2">
                      Renewable Cost ($)
                    </label>
                    <input
                      type="number"
                      id="renewableCost"
                      name="renewableCost"
                      step="0.01"
                      min="0"
                      value={formData.renewableCost}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="nonRenewableConsumption" className="block text-sm font-medium text-gray-700 mb-2">
                      Non-Renewable Consumption (kWh)
                    </label>
                    <input
                      type="number"
                      id="nonRenewableConsumption"
                      name="nonRenewableConsumption"
                      step="0.01"
                      min="0"
                      value={formData.nonRenewableConsumption}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="nonRenewableCost" className="block text-sm font-medium text-gray-700 mb-2">
                      Non-Renewable Cost ($)
                    </label>
                    <input
                      type="number"
                      id="nonRenewableCost"
                      name="nonRenewableCost"
                      step="0.01"
                      min="0"
                      value={formData.nonRenewableCost}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes about this energy usage..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/energy')}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <Loading size="sm" />
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Add Energy Data</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEnergyPage;