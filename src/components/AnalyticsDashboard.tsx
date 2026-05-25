import { useAppSelector } from '../store';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CreditCard, Users, TrendingUp, ShoppingBag, ArrowUpRight, Award, Flame, Star } from 'lucide-react';
import StatCard from './StatCard';
import { motion } from 'motion/react';

// Structured static analytics data for charts
const monthlyPerformance = [
  { month: 'Dec', revenue: 145000, hardware: 65000, software: 80000, orders: 120 },
  { month: 'Jan', revenue: 182000, hardware: 82000, software: 100000, orders: 145 },
  { month: 'Feb', revenue: 171000, hardware: 72000, software: 99000, orders: 130 },
  { month: 'Mar', revenue: 215000, hardware: 95000, software: 120000, orders: 185 },
  { month: 'Apr', revenue: 228000, hardware: 98000, software: 130000, orders: 198 },
  { month: 'May', revenue: 247890, hardware: 107890, software: 140000, orders: 240 },
];

const categoryDistribution = [
  { name: 'Hardware systems', value: 42, color: '#3b82f6' },
  { name: 'Licenses Software', value: 31, color: '#10b981' },
  { name: 'Security Devices', value: 16, color: '#f59e0b' },
  { name: 'Networking hardware', value: 11, color: '#8b5cf6' },
];

export default function AnalyticsDashboard() {
  const stats = useAppSelector((state) => state.stats.data);
  const users = useAppSelector((state) => state.users.list);
  const products = useAppSelector((state) => state.products.list);
  const orders = useAppSelector((state) => state.orders.list);
  
  // Custom tooltips (Enterprise UI matched)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3.5 shadow-xl font-mono text-xs select-none">
          <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="flex items-center gap-2 mt-1">
              <span className="block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-400 dark:text-slate-500 font-medium capitalize">{entry.name}:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {entry.name.includes('revenue') || entry.name.includes('ware') || entry.name.includes('License')
                  ? `$${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculating top indicators
  const lowStockAlertsCount = products.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock').length;
  const recentOrdersTotal = orders.length;

  return (
    <div className="flex flex-col gap-6 p-6">
      
      {/* Top Banner Message */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600/90 to-indigo-700/90 p-6 md:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-2xl flex hover:scale-105 transition-transform" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 max-w-xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100 font-mono flex items-center gap-1">
              <Flame className="h-3 w-3 text-amber-400 fill-amber-400" /> Platform Active Audit
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Good morning, Sarah Jenkins!
            </h2>
            <p className="text-xs md:text-sm text-blue-100 font-medium leading-relaxed">
              Your server arrays are reporting <span className="font-semibold underline">99.98% uptime</span>. Subscriptions have climbed by <span className="font-semibold">8.4%</span> since yesterday's reconciliation loop.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100 font-mono">Stock Errors</span>
              <span className="text-xl font-bold font-mono text-amber-300">{lowStockAlertsCount}</span>
            </div>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100 font-mono">Unread Alerts</span>
              <span className="text-xl font-bold font-mono text-rose-300">
                {useAppSelector((state) => state.notifications.list).filter((n) => !n.read).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Consolidated Revenue"
          value={`$${stats.totalRevenue.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          changeValue={stats.totalRevenue.change}
          series={stats.totalRevenue.series}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Active Accounts"
          value={`${stats.activeUsers.value.toLocaleString()}`}
          changeValue={stats.activeUsers.change}
          series={stats.activeUsers.series}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Platform Sales Count"
          value={`${stats.totalSales.value.toLocaleString()}`}
          changeValue={stats.totalSales.change}
          series={stats.totalSales.series}
          icon={ShoppingBag}
          color="indigo"
        />
        <StatCard
          title="Customer Retention"
          value={`${stats.conversionRate.value.toFixed(2)}%`}
          changeValue={stats.conversionRate.change}
          series={stats.conversionRate.series}
          icon={CreditCard}
          color="amber"
        />
      </div>

      {/* Main Charts Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* area chart: Revenue distribution */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                Financial Channels
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Billing streams vs hardware sales
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold font-mono border border-emerald-500/10 bg-emerald-500/5 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="h-3.5 w-3.5" /> +24% QoQ
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHardware" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSoftware" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area
                  type="monotone"
                  name="Hardware systems"
                  dataKey="hardware"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHardware)"
                />
                <Area
                  type="monotone"
                  name="Software Licenses"
                  dataKey="software"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSoftware)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Product category distribution */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
              Market Penetration
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Contract breakdown by product lines
            </span>
          </div>

          <div className="h-[220px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label inside Ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider">Total Share</span>
              <span className="text-xl font-extrabold text-slate-800 dark:text-slate-200">100%</span>
            </div>
          </div>

          {/* Custom Legends list */}
          <div className="flex flex-col gap-1.5 text-xs">
            {categoryDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts: Regional distribution & monthly orders trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart: Transactions Count */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
              Systems Transactions Volume
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Monthly sales operations reconciliation
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar name="Sales Orders Filled" dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enterprise telemetry cards */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
              System Telemetry Status
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Array node audit markers
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Card active Node */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-slate-600 dark:text-slate-455">API Gateway Server</span>
              </div>
              <span className="text-emerald-500 font-extrabold flex items-center gap-1">99.9% LIVE</span>
            </div>

            {/* Card CPU load */}
            <div className="flex flex-col gap-2 p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="font-semibold text-slate-600 dark:text-slate-455">CPU Resource Usage</span>
                <span className="font-bold text-slate-800 dark:text-slate-300">34.2%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '34.2%' }} />
              </div>
            </div>

            {/* Card DB Load */}
            <div className="flex flex-col gap-2 p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="font-semibold text-slate-600 dark:text-slate-455">Cluster Database Pool</span>
                <span className="font-bold text-slate-800 dark:text-slate-300">54.8%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-505 h-full bg-indigo-500 rounded-full" style={{ width: '54.8%' }} />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-150 dark:border-slate-850 pt-4 text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase font-mono block">
              Node ID: AMS-PROD-CLUSTER-04
            </span>
          </div>
        </div>
        
      </div>

    </div>
  );
}
