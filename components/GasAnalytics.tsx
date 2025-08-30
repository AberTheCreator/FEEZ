'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AnalyticsData } from '@/types';

const COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'];

export default function GasAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?timeframe=${timeframe}`);
      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="feez-card p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="feez-card p-8 text-center">
        <div className="text-gray-400 mb-4">📊</div>
        <div className="text-white font-semibold mb-2">No Analytics Data</div>
        <div className="text-gray-400 text-sm">Make some transactions to see your gas spending analytics</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="flex justify-end">
        <div className="feez-card p-1 flex">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-green-400 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="feez-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-green-400">
                ${analyticsData.totalSpentUSDC.toFixed(2)}
              </p>
            </div>
            <div className="text-green-400 text-2xl">💰</div>
          </div>
        </div>

        <div className="feez-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Transactions</p>
              <p className="text-2xl font-bold text-white">
                {analyticsData.totalTransactions}
              </p>
            </div>
            <div className="text-blue-400 text-2xl">📝</div>
          </div>
        </div>

        <div className="feez-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">This Week</p>
              <p className="text-2xl font-bold text-white">
                ${analyticsData.thisWeekSpent.toFixed(2)}
              </p>
            </div>
            <div className="text-purple-400 text-2xl">📅</div>
          </div>
        </div>

        <div className="feez-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Largest Payment</p>
              <p className="text-2xl font-bold text-white">
                ${analyticsData.largestGasPayment.toFixed(2)}
              </p>
            </div>
            <div className="text-orange-400 text-2xl">🚀</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Over Time */}
        <div className="feez-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Gas Spending Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #4ADE80',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value) => [`${Number(value).toFixed(2)}`, 'USDC Spent']}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#4ADE80" 
                strokeWidth={2}
                dot={{ fill: '#4ADE80', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#4ADE80', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chain Usage */}
        <div className="feez-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Chain Usage Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.chainUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ chain, percentage }) => `${chain} ${percentage.toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {analyticsData.chainUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #4ADE80',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value, name) => [value, 'Transactions']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chain Breakdown Table */}
      <div className="feez-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Chain Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-medium py-3">Chain</th>
                <th className="text-right text-gray-400 font-medium py-3">Transactions</th>
                <th className="text-right text-gray-400 font-medium py-3">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.chainUsage.map((chain, index) => (
                <tr key={chain.chain} className="border-b border-gray-800">
                  <td className="py-3 flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-white">{chain.chain}</span>
                  </td>
                  <td className="text-right text-white py-3">{chain.count}</td>
                  <td className="text-right text-gray-300 py-3">{chain.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
