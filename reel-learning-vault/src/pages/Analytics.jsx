import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useVault } from '../context/VaultContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  categorySeries,
  platformSeries,
  completionSeries,
  monthlyTrend,
} from '../lib/analytics.js';

export default function Analytics() {
  const { items } = useVault();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const categories = useMemo(() => categorySeries(items), [items]);
  const platforms = useMemo(() => platformSeries(items), [items]);
  const completion = useMemo(() => completionSeries(items), [items]);
  const trend = useMemo(() => monthlyTrend(items), [items]);

  const axis = dark ? '#94A3B8' : '#64748B';
  const grid = dark ? '#1E293B' : '#E2E8F0';
  const tooltipStyle = {
    backgroundColor: dark ? '#0F172A' : '#FFFFFF',
    border: `1px solid ${grid}`,
    borderRadius: 12,
    fontSize: 13,
    color: dark ? '#F1F5F9' : '#0F172A',
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No data to analyse yet"
        description="Add some learnings to unlock your analytics dashboard."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Learning by category */}
      <ChartCard title="Learning by Category" subtitle="Saved vs completed per skill">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categories} margin={{ left: -16, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: axis, fontSize: 11 }} angle={-35} textAnchor="end" height={70} interval={0} />
            <YAxis tick={{ fill: axis, fontSize: 12 }} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: dark ? '#1E293B55' : '#F1F5F955' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="total" name="Saved" fill="#818CF8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#22C55E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Completion rate donut */}
      <ChartCard title="Completion Rate" subtitle="Implemented or mastered vs in progress">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={completion} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
              {completion.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Most saved platforms */}
      <ChartCard title="Most Saved Platforms" subtitle="Where your content comes from">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={platforms} dataKey="value" nameKey="name" outerRadius={110} label>
              {platforms.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Monthly trend */}
      <ChartCard title="Monthly Learning Trend" subtitle="Added vs completed over 6 months">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trend} margin={{ left: -16, right: 8 }}>
            <defs>
              <linearGradient id="gAdded" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gDone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: axis, fontSize: 12 }} />
            <YAxis tick={{ fill: axis, fontSize: 12 }} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="added" name="Added" stroke="#6366F1" strokeWidth={2} fill="url(#gAdded)" />
            <Area type="monotone" dataKey="completed" name="Completed" stroke="#22C55E" strokeWidth={2} fill="url(#gDone)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
}
