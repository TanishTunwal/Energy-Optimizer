const EnergyUsage = require('../models/EnergyUsage');
const Recommendation = require('../models/Recommendation');

class MLRecommendationEngine {
  
  // Analyze energy usage patterns and generate recommendations
  static async generateRecommendations(userId) {
    try {
      const recommendations = [];
      
      // Get user's energy data for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const energyData = await EnergyUsage.find({
        userId,
        date: { $gte: thirtyDaysAgo }
      }).sort({ date: -1 });

      if (energyData.length === 0) {
        return [{
          type: 'energy_mix',
          title: 'Start Tracking Your Energy Usage',
          description: 'Begin by logging your daily energy consumption to receive personalized recommendations.',
          priority: 'high',
          recommendations: {
            actionItems: [{
              action: 'Log your first week of energy data',
              impact: 'high',
              effort: 'low',
              timeframe: 'immediate'
            }]
          },
          mlConfidence: 0.9
        }];
      }

      // Analyze renewable energy mix
      const renewableMixRecommendation = this.analyzeRenewableMix(energyData);
      if (renewableMixRecommendation) {
        recommendations.push(renewableMixRecommendation);
      }

      // Analyze cost optimization opportunities
      const costOptimizationRecommendation = this.analyzeCostOptimization(energyData);
      if (costOptimizationRecommendation) {
        recommendations.push(costOptimizationRecommendation);
      }

      // Analyze carbon footprint reduction
      const carbonReductionRecommendation = this.analyzeCarbonReduction(energyData);
      if (carbonReductionRecommendation) {
        recommendations.push(carbonReductionRecommendation);
      }

      // Analyze peak hour usage
      const peakHourRecommendation = this.analyzePeakHourUsage(energyData);
      if (peakHourRecommendation) {
        recommendations.push(peakHourRecommendation);
      }

      return recommendations;
    } catch (error) {
      console.error('Error generating ML recommendations:', error);
      throw error;
    }
  }

  // Analyze renewable energy mix and suggest improvements
  static analyzeRenewableMix(energyData) {
    const avgRenewablePercentage = energyData.reduce((sum, data) => 
      sum + data.renewablePercentage, 0) / energyData.length;

    if (avgRenewablePercentage < 50) {
      const targetPercentage = Math.min(avgRenewablePercentage + 20, 70);
      
      return {
        type: 'energy_mix',
        title: 'Increase Renewable Energy Usage',
        description: `Your current renewable energy usage is ${Math.round(avgRenewablePercentage)}%. Increasing to ${targetPercentage}% could provide significant benefits.`,
        priority: avgRenewablePercentage < 30 ? 'high' : 'medium',
        recommendations: {
          currentEnergyMix: {
            renewablePercentage: Math.round(avgRenewablePercentage),
            nonRenewablePercentage: Math.round(100 - avgRenewablePercentage)
          },
          suggestedEnergyMix: {
            renewablePercentage: targetPercentage,
            nonRenewablePercentage: 100 - targetPercentage
          },
          potentialSavings: {
            costSavings: this.calculatePotentialSavings(energyData, targetPercentage),
            carbonReduction: this.calculateCarbonReduction(energyData, targetPercentage)
          },
          actionItems: [
            {
              action: 'Install solar panels or increase solar capacity',
              impact: 'high',
              effort: 'high',
              timeframe: 'long_term'
            },
            {
              action: 'Switch to a renewable energy provider',
              impact: 'medium',
              effort: 'low',
              timeframe: 'immediate'
            },
            {
              action: 'Optimize energy usage during peak solar hours',
              impact: 'medium',
              effort: 'medium',
              timeframe: 'short_term'
            }
          ]
        },
        mlConfidence: 0.8
      };
    }
    return null;
  }

  // Analyze cost optimization opportunities
  static analyzeCostOptimization(energyData) {
    const avgCostPerKwh = energyData.reduce((sum, data) => {
      const costPerKwh = data.totalConsumption > 0 ? data.totalCost / data.totalConsumption : 0;
      return sum + costPerKwh;
    }, 0) / energyData.length;

    if (avgCostPerKwh > 0.15) { // If cost per kWh is above $0.15
      return {
        type: 'cost_optimization',
        title: 'Reduce Energy Costs',
        description: `Your average cost per kWh is $${avgCostPerKwh.toFixed(3)}. Here are ways to reduce your energy expenses.`,
        priority: 'medium',
        recommendations: {
          potentialSavings: {
            costSavings: this.calculateMonthlyCostSavings(energyData),
            energyEfficiency: this.calculateEfficiencyGains(energyData)
          },
          actionItems: [
            {
              action: 'Use energy during off-peak hours',
              impact: 'medium',
              effort: 'low',
              timeframe: 'immediate'
            },
            {
              action: 'Invest in energy-efficient appliances',
              impact: 'high',
              effort: 'medium',
              timeframe: 'short_term'
            },
            {
              action: 'Implement smart energy management systems',
              impact: 'high',
              effort: 'high',
              timeframe: 'long_term'
            }
          ]
        },
        mlConfidence: 0.75
      };
    }
    return null;
  }

  // Analyze carbon footprint reduction opportunities
  static analyzeCarbonReduction(energyData) {
    const avgCarbonFootprint = energyData.reduce((sum, data) => 
      sum + data.carbonFootprint, 0) / energyData.length;

    if (avgCarbonFootprint > 50) { // If daily carbon footprint > 50 kg CO2
      return {
        type: 'carbon_reduction',
        title: 'Reduce Carbon Footprint',
        description: `Your average daily carbon footprint is ${Math.round(avgCarbonFootprint)} kg CO2. Let's work on reducing this.`,
        priority: avgCarbonFootprint > 100 ? 'high' : 'medium',
        recommendations: {
          potentialSavings: {
            carbonReduction: Math.round(avgCarbonFootprint * 0.3 * 30) // 30% reduction monthly
          },
          actionItems: [
            {
              action: 'Shift to renewable energy sources',
              impact: 'high',
              effort: 'medium',
              timeframe: 'short_term'
            },
            {
              action: 'Improve energy efficiency',
              impact: 'medium',
              effort: 'medium',
              timeframe: 'short_term'
            },
            {
              action: 'Carbon offset programs',
              impact: 'medium',
              effort: 'low',
              timeframe: 'immediate'
            }
          ]
        },
        mlConfidence: 0.85
      };
    }
    return null;
  }

  // Analyze peak hour usage patterns
  static analyzePeakHourUsage(energyData) {
    const dataWithPeakUsage = energyData.filter(data => data.peakHours.consumption > 0);
    
    if (dataWithPeakUsage.length === 0) return null;

    const avgPeakUsage = dataWithPeakUsage.reduce((sum, data) => 
      sum + data.peakHours.consumption, 0) / dataWithPeakUsage.length;

    const avgTotalUsage = dataWithPeakUsage.reduce((sum, data) => 
      sum + data.totalConsumption, 0) / dataWithPeakUsage.length;

    const peakUsagePercentage = (avgPeakUsage / avgTotalUsage) * 100;

    if (peakUsagePercentage > 60) { // If more than 60% usage during peak hours
      return {
        type: 'peak_hour_shift',
        title: 'Optimize Peak Hour Usage',
        description: `${Math.round(peakUsagePercentage)}% of your energy is consumed during peak hours. Shifting usage can reduce costs.`,
        priority: 'medium',
        recommendations: {
          potentialSavings: {
            costSavings: this.calculatePeakHourSavings(dataWithPeakUsage)
          },
          actionItems: [
            {
              action: 'Schedule high-energy tasks during off-peak hours',
              impact: 'high',
              effort: 'low',
              timeframe: 'immediate'
            },
            {
              action: 'Install energy storage systems',
              impact: 'high',
              effort: 'high',
              timeframe: 'long_term'
            },
            {
              action: 'Use smart timers for appliances',
              impact: 'medium',
              effort: 'medium',
              timeframe: 'short_term'
            }
          ]
        },
        mlConfidence: 0.7
      };
    }
    return null;
  }

  // Helper methods for calculations
  static calculatePotentialSavings(energyData, targetRenewablePercentage) {
    const avgMonthlyCost = energyData.reduce((sum, data) => sum + data.totalCost, 0);
    const currentRenewablePercentage = energyData.reduce((sum, data) => 
      sum + data.renewablePercentage, 0) / energyData.length;
    
    const improvement = (targetRenewablePercentage - currentRenewablePercentage) / 100;
    return Math.round(avgMonthlyCost * improvement * 0.2); // Assuming 20% cost reduction per renewable improvement
  }

  static calculateCarbonReduction(energyData, targetRenewablePercentage) {
    const avgMonthlyCarbonFootprint = energyData.reduce((sum, data) => sum + data.carbonFootprint, 0);
    const currentRenewablePercentage = energyData.reduce((sum, data) => 
      sum + data.renewablePercentage, 0) / energyData.length;
    
    const improvement = (targetRenewablePercentage - currentRenewablePercentage) / 100;
    return Math.round(avgMonthlyCarbonFootprint * improvement * 0.5); // Assuming 50% carbon reduction per renewable improvement
  }

  static calculateMonthlyCostSavings(energyData) {
    const avgMonthlyCost = energyData.reduce((sum, data) => sum + data.totalCost, 0);
    return Math.round(avgMonthlyCost * 0.15); // Assuming 15% potential savings
  }

  static calculateEfficiencyGains(energyData) {
    const avgMonthlyConsumption = energyData.reduce((sum, data) => sum + data.totalConsumption, 0);
    return Math.round(avgMonthlyConsumption * 0.1); // Assuming 10% efficiency gains
  }

  static calculatePeakHourSavings(energyData) {
    const avgPeakCost = energyData.reduce((sum, data) => 
      sum + (data.peakHours.consumption * 0.2), 0); // Assuming $0.20/kWh peak rate
    return Math.round(avgPeakCost * 0.3); // Assuming 30% savings by shifting
  }
}

module.exports = MLRecommendationEngine;
