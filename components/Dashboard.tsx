
import React from 'react';
import { AppStats } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface DashboardProps {
  stats: AppStats;
}

const COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc'];

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const userDist = [
    { name: 'طلاب', value: stats.totalStudents },
    { name: 'أساتذة', value: stats.totalProfessors },
    { name: 'زوار', value: stats.currentGuests },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-sky-900 border-r-8 border-sky-600 pr-4">لوحة تحكم النظام (zero)</h2>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-sky-500">
          <p className="text-sky-600 text-sm font-bold">المستخدمون النشطون</p>
          <h3 className="text-4xl font-bold mt-2 text-sky-900">{stats.activeUsers}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-green-500">
          <p className="text-green-600 text-sm font-bold">الطلاب المسجلون</p>
          <h3 className="text-4xl font-bold mt-2 text-sky-900">{stats.totalStudents}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-purple-500">
          <p className="text-purple-600 text-sm font-bold">الأساتذة</p>
          <h3 className="text-4xl font-bold mt-2 text-sky-900">{stats.totalProfessors}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-amber-500">
          <p className="text-amber-600 text-sm font-bold">الزوار الحاليون</p>
          <h3 className="text-4xl font-bold mt-2 text-sky-900">{stats.currentGuests}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Charts Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-sky-100">
          <h4 className="font-bold text-sky-800 mb-6">توزيع المستخدمين</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={userDist} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {userDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs font-bold text-sky-800">
            {userDist.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span>{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-sky-100">
          <h4 className="font-bold text-sky-800 mb-6">أكثر المواد تحميلاً</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.mostDownloaded}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="bg-sky-900 text-sky-100 p-6 rounded-2xl shadow-xl naskh">
        <h4 className="font-bold text-lg mb-4 border-b border-sky-700 pb-2">آخر العمليات في الموقع</h4>
        <div className="space-y-2 text-sm">
          {stats.recentLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-2 border-r-2 border-sky-600 pr-2">
              <span className="opacity-50 text-[10px]">{new Date().toLocaleTimeString()}</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
