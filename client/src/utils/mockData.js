// Mock data for testing UI when backend is having issues
export const mockEnergyData = [
  {
    _id: '1',
    date: '2025-07-13',
    totalConsumption: 150,
    totalCost: 75,
    renewablePercentage: 67,
    energyData: {
      renewable: {
        solar: { consumption: 100, cost: 40 }
      },
      nonRenewable: {
        grid: { consumption: 50, cost: 35 }
      }
    }
  },
  {
    _id: '2',
    date: '2025-07-12',
    totalConsumption: 120,
    totalCost: 65,
    renewablePercentage: 58,
    energyData: {
      renewable: {
        solar: { consumption: 70, cost: 30 }
      },
      nonRenewable: {
        grid: { consumption: 50, cost: 35 }
      }
    }
  },
  {
    _id: '3',
    date: '2025-07-11',
    totalConsumption: 180,
    totalCost: 85,
    renewablePercentage: 72,
    energyData: {
      renewable: {
        solar: { consumption: 130, cost: 50 }
      },
      nonRenewable: {
        grid: { consumption: 50, cost: 35 }
      }
    }
  }
];

export const mockRecommendations = [
  {
    _id: '1',
    title: 'Increase Solar Panel Capacity',
    description: 'Consider adding more solar panels to increase renewable energy percentage.',
    priority: 'high',
    type: 'energy_mix',
    status: 'pending',
    potentialSavings: 150,
    score: 8.5,
    impact: {
      energySavings: 420,
      costSavings: 150,
      carbonReduction: 312
    }
  },
  {
    _id: '2',
    title: 'Optimize Peak Hour Usage',
    description: 'Shift energy-intensive operations to off-peak hours.',
    priority: 'medium',
    type: 'cost_optimization',
    status: 'pending',
    potentialSavings: 75,
    score: 7.2,
    impact: {
      energySavings: 180,
      costSavings: 75,
      carbonReduction: 134
    }
  }
];

export const mockStats = {
  totalEnergyUsed: 450,
  totalCost: 225,
  renewablePercentage: 65.7,
  energyTrend: 5.2,
  carbonFootprint: 89.5
};
