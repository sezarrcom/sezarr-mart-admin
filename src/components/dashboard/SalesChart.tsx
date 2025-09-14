'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Generate daily data for September 2025
const generateDailyData = () => {
  const data = []
  for (let day = 1; day <= 30; day++) {
    data.push({
      day: day.toString(),
      customers: Math.floor(Math.random() * 0.2) + 0.8, // Random between 0.8 and 1.0
      orders: Math.floor(Math.random() * 0.2) + 0.8
    })
  }
  return data
}

const dailyData = generateDailyData()

export default function SalesChart() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Customers Chart */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Customers - September, 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#666' }}
                  domain={[0, 1.2]}
                />
                <Tooltip 
                  formatter={(value) => [typeof value === 'number' ? value.toFixed(1) : value, 'Customers']}
                  labelFormatter={(label) => `Day ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Orders Chart */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Orders - September, 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#666' }}
                  domain={[0, 1.2]}
                />
                <Tooltip 
                  formatter={(value) => [typeof value === 'number' ? value.toFixed(1) : value, 'Orders']}
                  labelFormatter={(label) => `Day ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}