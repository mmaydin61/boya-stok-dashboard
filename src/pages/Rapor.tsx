import { FileBarChart, Download, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { AppData, BoyaTipi } from '../types';
import { BOYA_RENKLERI } from '../data/initialData';

interface RaporProps {
  data: AppData;
  boyaBazindaSarfiyat: Record<BoyaTipi, number>;
  toplamStok: Record<BoyaTipi, number>;
}

export function Rapor({ data, boyaBazindaSarfiyat, toplamStok }: RaporProps) {
  const hedefler = {
    Metalik: 300,
    Mavi: 250,
    Beyaz: 350,
  };

  const raporData = [
    {
      boyaTipi: 'Metalik',
      buHafta: boyaBazindaSarfiyat.Metalik,
      hedef: hedefler.Metalik,
      fark: boyaBazindaSarfiyat.Metalik - hedefler.Metalik,
      yuzde: hedefler.Metalik > 0 ? (boyaBazindaSarfiyat.Metalik / hedefler.Metalik) * 100 : 0,
      stok: toplamStok.Metalik,
    },
    {
      boyaTipi: 'Mavi',
      buHafta: boyaBazindaSarfiyat.Mavi,
      hedef: hedefler.Mavi,
      fark: boyaBazindaSarfiyat.Mavi - hedefler.Mavi,
      yuzde: hedefler.Mavi > 0 ? (boyaBazindaSarfiyat.Mavi / hedefler.Mavi) * 100 : 0,
      stok: toplamStok.Mavi,
    },
    {
      boyaTipi: 'Beyaz',
      buHafta: boyaBazindaSarfiyat.Beyaz,
      hedef: hedefler.Beyaz,
      fark: boyaBazindaSarfiyat.Beyaz - hedefler.Beyaz,
      yuzde: hedefler.Beyaz > 0 ? (boyaBazindaSarfiyat.Beyaz / hedefler.Beyaz) * 100 : 0,
      stok: toplamStok.Beyaz,
    },
  ];

  const toplamBuHafta = raporData.reduce((acc, r) => acc + r.buHafta, 0);
  const toplamHedef = raporData.reduce((acc, r) => acc + r.hedef, 0);
  const toplamYuzde = toplamHedef > 0 ? (toplamBuHafta / toplamHedef) * 100 : 0;

  const radarData = raporData.map((r) => ({
    subject: r.boyaTipi,
    Gerçekleşen: r.buHafta,
    Hedef: r.hedef,
  }));

  const karsilastirmaData = raporData.map((r) => ({
    name: r.boyaTipi,
    Sarfiyat: r.buHafta,
    Hedef: r.hedef,
  }));

  const handleExport = () => {
    const csvContent = [
      ['Boya Tipi', 'Bu Hafta (kg)', 'Hedef (kg)', 'Fark (kg)', 'Yüzde (%)'],
      ...raporData.map((r) => [r.boyaTipi, r.buHafta.toFixed(1), r.hedef, r.fark.toFixed(1), r.yuzde.toFixed(1)]),
      ['TOPLAM', toplamBuHafta.toFixed(1), toplamHedef, (toplamBuHafta - toplamHedef).toFixed(1), toplamYuzde.toFixed(1)],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `boya-rapor-hafta-${data.haftalikSarfiyat.haftaNo}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Özet Rapor</h1>
          <p className="text-slate-400 mt-1">Hafta {data.haftalikSarfiyat.haftaNo} - Sarfiyat ve Stok Analizi</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          CSV İndir
        </button>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl border border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Toplam Sarfiyat</p>
              <p className="text-3xl font-bold text-white mt-2">{toplamBuHafta.toFixed(1)} kg</p>
              <p className="text-slate-400 text-sm mt-1">Bu hafta</p>
            </div>
            <FileBarChart className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Hedef</p>
              <p className="text-3xl font-bold text-white mt-2">{toplamHedef} kg</p>
              <p className="text-slate-400 text-sm mt-1">Haftalık hedef</p>
            </div>
            <Target className="w-10 h-10 text-purple-400" />
          </div>
        </div>

        <div className={`bg-gradient-to-br ${toplamYuzde >= 100 ? 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30' : 'from-amber-600/20 to-orange-600/20 border-amber-500/30'} rounded-2xl border p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${toplamYuzde >= 100 ? 'text-emerald-400' : 'text-amber-400'} text-sm font-medium`}>Gerçekleşme</p>
              <p className="text-3xl font-bold text-white mt-2">%{toplamYuzde.toFixed(1)}</p>
              <p className="text-slate-400 text-sm mt-1">Hedefe göre</p>
            </div>
            {toplamYuzde >= 100 ? (
              <TrendingUp className="w-10 h-10 text-emerald-400" />
            ) : (
              <TrendingDown className="w-10 h-10 text-amber-400" />
            )}
          </div>
        </div>
      </div>

      {/* Detay Tablo */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-white">Haftalık Toplam Sarfiyat</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Boya Tipi</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Bu Hafta (kg)</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Hedef (kg)</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Fark (kg)</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Yüzde</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Durum</th>
              </tr>
            </thead>
            <tbody>
              {raporData.map((rapor) => (
                <tr key={rapor.boyaTipi} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: BOYA_RENKLERI[rapor.boyaTipi as BoyaTipi].primary }}
                      />
                      <span className="text-white font-medium">{rapor.boyaTipi}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-white font-semibold">{rapor.buHafta.toFixed(1)}</td>
                  <td className="px-6 py-4 text-center text-slate-400">{rapor.hedef}</td>
                  <td className={`px-6 py-4 text-center font-semibold ${rapor.fark >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {rapor.fark >= 0 ? '+' : ''}{rapor.fark.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${rapor.yuzde >= 100 ? 'bg-emerald-500' : rapor.yuzde >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(rapor.yuzde, 100)}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-sm">{rapor.yuzde.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {rapor.yuzde >= 100 ? (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Hedefe Ulaşıldı</span>
                    ) : rapor.yuzde >= 75 ? (
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">Devam Ediyor</span>
                    ) : (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Geride</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900/70">
                <td className="px-6 py-4 text-white font-bold">TOPLAM</td>
                <td className="px-6 py-4 text-center text-white font-bold">{toplamBuHafta.toFixed(1)}</td>
                <td className="px-6 py-4 text-center text-slate-400 font-bold">{toplamHedef}</td>
                <td className={`px-6 py-4 text-center font-bold ${toplamBuHafta - toplamHedef >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {toplamBuHafta - toplamHedef >= 0 ? '+' : ''}{(toplamBuHafta - toplamHedef).toFixed(1)}
                </td>
                <td className="px-6 py-4 text-center text-white font-bold">{toplamYuzde.toFixed(0)}%</td>
                <td className="px-6 py-4" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Karşılaştırma Grafiği */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sarfiyat vs Hedef</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={karsilastirmaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="Sarfiyat" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Hedef" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Grafiği */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performans Radar</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                <PolarRadiusAxis stroke="#94a3b8" />
                <Radar name="Gerçekleşen" dataKey="Gerçekleşen" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Radar name="Hedef" dataKey="Hedef" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
