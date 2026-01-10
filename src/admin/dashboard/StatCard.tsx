import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  prefix?: string;
}

export function StatCard({ title, value, change, icon: Icon, prefix }: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={cn(
            isPositive && 'stat-change-positive',
            isNegative && 'stat-change-negative',
            !isPositive && !isNegative && 'text-muted-foreground text-sm'
          )}>
            {isPositive && <TrendingUp className="w-4 h-4" />}
            {isNegative && <TrendingDown className="w-4 h-4" />}
            <span>{isPositive && '+'}{change}%</span>
          </div>
        )}
      </div>
      <div className="stat-value">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="stat-label mt-1">{title}</div>
    </div>
  );
}
