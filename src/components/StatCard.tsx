import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string;
  changeValue: number;
  series: number[];
  icon: LucideIcon;
  color: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo';
}

export default function StatCard({
  title,
  value,
  changeValue,
  series,
  icon: IconComponent,
  color,
}: StatCardProps) {
  const isPositive = changeValue >= 0;

  // Generate proportional SVG Sparkline path coordinates
  const width = 120;
  const height = 40;
  const padding = 2;
  const minVal = Math.min(...series);
  const maxVal = Math.max(...series);
  const valRange = maxVal - minVal || 1;

  const points = series
    .map((val, idx) => {
      const x = (idx / (series.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((val - minVal) / valRange) * (height - padding * 2) - padding;
      return `${x},${y}`;
    })
    .join(' ');

  // Colors config
  const colorSchemes = {
    blue: {
      bg: 'from-blue-600/5 to-indigo-600/5',
      border: 'hover:border-blue-500/25',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      sparkBg: 'stroke-blue-500 dark:stroke-blue-400',
      shadowBg: 'shadow-blue-500/5',
    },
    emerald: {
      bg: 'from-emerald-600/5 to-teal-600/5',
      border: 'hover:border-emerald-500/25',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      sparkBg: 'stroke-emerald-500 dark:stroke-emerald-400',
      shadowBg: 'shadow-emerald-500/5',
    },
    amber: {
      bg: 'from-amber-600/5 to-orange-600/5',
      border: 'hover:border-amber-500/25',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-450',
      sparkBg: 'stroke-amber-500 dark:stroke-amber-450',
      shadowBg: 'shadow-amber-500/5',
    },
    rose: {
      bg: 'from-rose-600/5 to-red-600/5',
      border: 'hover:border-rose-500/25',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-450',
      sparkBg: 'stroke-rose-500 dark:stroke-rose-450',
      shadowBg: 'shadow-rose-500/5',
    },
    indigo: {
      bg: 'from-indigo-600/5 to-violet-600/5',
      border: 'hover:border-indigo-500/25',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      sparkBg: 'stroke-indigo-500 dark:stroke-indigo-400',
      shadowBg: 'shadow-indigo-500/5',
    },
  };

  const currentScheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 bg-linear-to-tr ${currentScheme.bg} p-6 shadow-xs ${currentScheme.shadowBg} transition-all duration-200 ${currentScheme.border}`}
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-linear-to-tr from-transparent to-current opacity-3/100 pointer-events-none filter blur-xl" />

      <div className="flex items-start justify-between">
        {/* Left column */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
            {title}
          </span>
          <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-50 font-mono">
            {value}
          </span>

          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15'
              }`}
            >
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(changeValue)}%
            </span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-tight">
              vs trailing month
            </span>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col items-end justify-between h-full gap-5">
          {/* Icon */}
          <div className={`rounded-xl p-2.5 ${currentScheme.iconBg}`}>
            <IconComponent className="h-4.5 w-4.5" />
          </div>

          {/* Sparkline chart */}
          <div className="mt-2" title={`Sparkline data stream for ${title}`}>
            <svg width={width} height={height} className="overflow-visible">
              <polyline
                fill="none"
                className={currentScheme.sparkBg}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {/* Optional glowing effect for the sparkline path */}
              <polyline
                fill="none"
                className={`${currentScheme.sparkBg} opacity-20 filter blur-xs`}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
