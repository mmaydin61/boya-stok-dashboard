import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import type { BoyaTipi } from '../types';
import { BOYA_RENKLERI } from '../data/initialData';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

const colorClasses = {
  blue: 'from-blue-600 to-cyan-500',
  green: 'from-emerald-600 to-teal-500',
  orange: 'from-orange-600 to-amber-500',
  purple: 'from-purple-600 to-pink-500',
  red: 'from-red-600 to-rose-500',
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'blue' }: StatCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
            }`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

interface StockCardProps {
  boyaTipi: BoyaTipi;
  kalanStok: number;
  minStok: number;
  durum: 'Normal' | 'Düşük' | 'Kritik';
}

export function StockCard({ boyaTipi, kalanStok, minStok, durum }: StockCardProps) {
  const renkler = BOYA_RENKLERI[boyaTipi];
  const yuzde = Math.min((kalanStok / (minStok * 2)) * 100, 100);

  const durumRenk = {
    Normal: 'bg-emerald-500',
    Düşük: 'bg-amber-500',
    Kritik: 'bg-red-500 pulse-warning',
  };

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 ${durum === 'Kritik' ? 'border-red-500/50' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: renkler.primary }}
          />
          <h3 className="text-lg font-semibold text-white">{boyaTipi} Boya</h3>
        </div>
        {durum !== 'Normal' && (
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${durum === 'Kritik' ? 'text-red-400' : 'text-amber-400'}`} />
            <span className={`text-sm font-medium ${durum === 'Kritik' ? 'text-red-400' : 'text-amber-400'}`}>
              {durum}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Kalan Stok</span>
          <span className="text-white font-semibold">{kalanStok.toFixed(1)} kg</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${durumRenk[durum]}`}
            style={{ width: `${yuzde}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Min: {minStok} kg</span>
          <span>{yuzde.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}

interface AlertCardProps {
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'info';
}

export function AlertCard({ title, message, type }: AlertCardProps) {
  const styles = {
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    danger: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[type]}`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-1 text-sm opacity-80">{message}</p>
    </div>
  );
}
