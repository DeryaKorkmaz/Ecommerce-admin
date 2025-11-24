import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const StatCard = ({ title, value, icon, color }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <Typography color="textSecondary" gutterBottom variant="body2" className="uppercase font-medium tracking-wider">
          {title}
        </Typography>
        <Typography variant="h4" className="font-bold text-gray-800">
          {value}
        </Typography>
      </div>
      <div className={`p-3 rounded-full ${color} text-white`}>
        {icon}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome back, here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value="₺124,500"
          icon={<AttachMoneyIcon />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value="1,240"
          icon={<ShoppingBagIcon />}
          color="bg-blue-500"
        />
        <StatCard
          title="New Customers"
          value="85"
          icon={<PeopleIcon />}
          color="bg-purple-500"
        />
        <StatCard
          title="Growth"
          value="+12.5%"
          icon={<TrendingUpIcon />}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardContent>
            <Typography variant="h6" className="font-bold mb-4">Recent Activity</Typography>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">New order #123{i} received</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent>
            <Typography variant="h6" className="font-bold mb-4">Top Products</Typography>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Premium Product {i}</p>
                      <p className="text-xs text-gray-500">Electronics</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-700">₺1,200</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
