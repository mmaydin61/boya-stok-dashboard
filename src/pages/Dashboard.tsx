import { useState, useEffect } from 'react';
import { Droplets, Package, TrendingUp, AlertTriangle, Calendar, Clock, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { StatCard, StockCard, AlertCard } from '../components/Cards';
import type { AppData, BoyaTipi } from '../types';
import { BOYA_RENKLERI } from '../data/initialData';

interface DashboardProps {
  data: AppData;
  toplamHaftalikSarfiyat: number;
  boyaBazindaSarfiyat: Record<BoyaTipi, number>;
  toplamStok: Record<BoyaTipi, number>;
  kritikStoklar: any[];
}

export function Dashboard({
  data,
  toplamHaftalikSarfiyat,
  boyaBazindaSarfiyat,
  toplamStok,
  kritikStoklar,
}: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date in Turkish
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Grafik verileri - günlük toplam sarfiyat
  const gunlukSarfiyatData = data.haftalikSarfiyat.gunler.map(gun => ({
    gun: gun.gun.substring(0, 3),
    Toplam: gun.gunlukToplam || 0,
  }));

  const pieData = [
    { name: 'Metalik', value: boyaBazindaSarfiyat.Metalik, color: BOYA_RENKLERI.Metalik.primary },
    { name: 'Mavi', value: boyaBazindaSarfiyat.Mavi, color: BOYA_RENKLERI.Mavi.primary },
    { name: 'Beyaz', value: boyaBazindaSarfiyat.Beyaz, color: BOYA_RENKLERI.Beyaz.primary },
    { name: 'Kırmızı', value: boyaBazindaSarfiyat.Kırmızı, color: BOYA_RENKLERI.Kırmızı.primary },
    { name: 'Pembe', value: boyaBazindaSarfiyat.Pembe, color: BOYA_RENKLERI.Pembe.primary },
  ].filter(d => d.value > 0);

  const stokData = [
    { name: 'Metalik', stok: toplamStok.Metalik, min: data.depoStok.metalik[0]?.minStokSeviyesi || 0 },
    { name: 'Mavi', stok: toplamStok.Mavi, min: data.depoStok.mavi[0]?.minStokSeviyesi || 0 },
    { name: 'Beyaz', stok: toplamStok.Beyaz, min: data.depoStok.beyaz[0]?.minStokSeviyesi || 0 },
    { name: 'Kırmızı', stok: toplamStok.Kırmızı, min: data.depoStok.kirmizi[0]?.minStokSeviyesi || 0 },
    { name: 'Pembe', stok: toplamStok.Pembe, min: data.depoStok.pembe[0]?.minStokSeviyesi || 0 },
  ];

  const toplamStokMiktar = toplamStok.Metalik + toplamStok.Mavi + toplamStok.Beyaz + toplamStok.Kırmızı + toplamStok.Pembe;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400">Hafta {data.haftalikSarfiyat.haftaNo} - Boya Stok Durumu</p>
              </div>
            </div>
          </div>
          <div className="text-right bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(currentTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-white text-2xl font-mono">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Uyarılar */}
      {kritikStoklar.length > 0 && (
        <div className="grid gap-3">
          {kritikStoklar.map((stok, i) => (
            <AlertCard
              key={i}
              title={`${stok.boyaTipi} Stok Uyarısı`}
              message={`${stok.hafta}: Kalan stok ${stok.kalanStok} kg - ${stok.durum} seviye!`}
              type={stok.durum === 'Kritik' ? 'danger' : 'warning'}
            />
          ))}
        </div>
      )}

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Haftalık Toplam Sarfiyat"
          value={`${toplamHaftalikSarfiyat.toFixed(1)} kg`}
          subtitle="Bu haftaki tüketim"
          icon={Droplets}
          color="blue"
        />
        <StatCard
          title="Toplam Stok"
          value={`${toplamStokMiktar.toFixed(1)} kg`}
          subtitle="Tüm boya türleri"
          icon={Package}
          color="green"
        />
        <StatCard
          title="Günlük Ortalama"
          value={`${(toplamHaftalikSarfiyat / 7).toFixed(1)} kg`}
          subtitle="Sarfiyat ortalaması"
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Stok Uyarıları"
          value={kritikStoklar.length}
          subtitle={kritikStoklar.length > 0 ? 'Dikkat gerektiren' : 'Sorun yok'}
          icon={AlertTriangle}
          color={kritikStoklar.length > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Stok Kartları */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-cyan-400" />
          Boya Stok Durumu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StockCard
            boyaTipi="Metalik"
            kalanStok={toplamStok.Metalik}
            minStok={data.depoStok.metalik[0]?.minStokSeviyesi || 200}
            durum={data.depoStok.metalik[0]?.durum || 'Normal'}
          />
          <StockCard
            boyaTipi="Mavi"
            kalanStok={toplamStok.Mavi}
            minStok={data.depoStok.mavi[0]?.minStokSeviyesi || 150}
            durum={data.depoStok.mavi[0]?.durum || 'Normal'}
          />
          <StockCard
            boyaTipi="Beyaz"
            kalanStok={toplamStok.Beyaz}
            minStok={data.depoStok.beyaz[0]?.minStokSeviyesi || 250}
            durum={data.depoStok.beyaz[0]?.durum || 'Normal'}
          />
          <StockCard
            boyaTipi="Kırmızı"
            kalanStok={toplamStok.Kırmızı}
            minStok={data.depoStok.kirmizi[0]?.minStokSeviyesi || 150}
            durum={data.depoStok.kirmizi[0]?.durum || 'Normal'}
          />
          <StockCard
            boyaTipi="Pembe"
            kalanStok={toplamStok.Pembe}
            minStok={data.depoStok.pembe[0]?.minStokSeviyesi || 100}
            durum={data.depoStok.pembe[0]?.durum || 'Normal'}
          />
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Günlük Sarfiyat Grafiği */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Günlük Sarfiyat
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gunlukSarfiyatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="gun" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="Toplam" name="Günlük Toplam" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Boya Dağılımı */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            Sarfiyat Dağılımı
          </h3>
          <div className="h-72">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)} kg`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <Droplets className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Henüz sarfiyat verisi yok</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stok Karşılaştırma */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" />
            Stok Durumu vs Minimum Seviye
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stokData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="stok" name="Mevcut Stok" fill="#22c55e" radius={[0, 4, 4, 0]} />
                <Bar dataKey="min" name="Min. Seviye" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-4 text-center">
        <p className="text-slate-500 text-sm">
          Veriler otomatik olarak kaydedilmektedir • Son güncelleme: {formatTime(currentTime)}
        </p>
      </div>
    </div>
  );
}
