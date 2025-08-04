import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Filter } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import { dashboardAPI } from '../../services/api';
import { DashboardMetrics } from '../../types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

export const Reports: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [reportType, setReportType] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await dashboardAPI.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reportOptions = [
    { value: 'monthly', label: 'Monthly Overview' },
    { value: 'inventory', label: 'Inventory Analysis' },
    { value: 'movement', label: 'Movement History' }
  ];

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const movementData = {
    labels: metrics.monthlyInward.map(item => {
      const date = new Date(item.month + '-01');
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Inward Quantity',
        data: metrics.monthlyInward.map(item => item.quantity),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Outward Quantity',
        data: metrics.monthlyOutward.map(item => item.quantity),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Inventory Movement Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive inventory insights</p>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Select
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={reportOptions}
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Generated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Inward</h3>
          <p className="text-3xl font-bold text-green-600">
            {metrics.monthlyInward[metrics.monthlyInward.length - 1]?.quantity || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {metrics.monthlyInward[metrics.monthlyInward.length - 1]?.count || 0} transactions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Outward</h3>
          <p className="text-3xl font-bold text-red-600">
            {metrics.monthlyOutward[metrics.monthlyOutward.length - 1]?.quantity || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {metrics.monthlyOutward[metrics.monthlyOutward.length - 1]?.count || 0} transactions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Net Change</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(metrics.monthlyInward[metrics.monthlyInward.length - 1]?.quantity || 0) - 
             (metrics.monthlyOutward[metrics.monthlyOutward.length - 1]?.quantity || 0)}
          </p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Movement Trends</h3>
        <div className="h-96">
          <Bar data={movementData} options={chartOptions} />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Component Category Distribution</h3>
        <div className="space-y-4">
          {metrics.categoryDistribution.map((category, index) => {
            const percentage = (category.count / metrics.totalComponents) * 100;
            const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
            
            return (
              <div key={category.category} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium text-gray-700">
                  {category.category}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${colors[index % colors.length]}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {category.count} ({percentage.toFixed(1)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};