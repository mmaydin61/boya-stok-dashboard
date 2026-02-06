import { Droplets, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
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
  // Grafik verileri
  const gunlukSarfiyatData = data.haftalikSarfiyat.gunler.map(gun => ({
    gun: gun.gun.substring(0, 3),
    Metalik: (gun.pik1Sarfiyat || 0) + (gun.ev1Sarfiyat || 0),
    Mavi: (gun.pik2Sarfiyat || 0) + (gun.ev2Sarfiyat || 0),
    Beyaz: (gun.pik3Sarfiyat || 0) + (gun.ev3Sarfiyat || 0),
    Toplam: gun.gunlukToplam,
  }));

  const pieData = [
    { name: 'Metalik', value: boyaBazindaSarfiyat.Metalik, color: BOYA_RENKLERI.Metalik.primary },
    { name: 'Mavi', value: boyaBazindaSarfiyat.Mavi, color: BOYA_RENKLERI.Mavi.primary },
    { name: 'Beyaz', value: boyaBazindaSarfiyat.Beyaz, color: BOYA_RENKLERI.Beyaz.primary },
  ].filter(d => d.value > 0);

  const stokData = [
    { name: 'Metalik', stok: toplamStok.Metalik, min: data.depoStok.metalik[0]?.minStokSeviyesi || 0 },
    { name: 'Mavi', stok: toplamStok.Mavi, min: data.depoStok.mavi[0]?.minStokSeviyesi || 0 },
    { name: 'Beyaz', stok: toplamStok.Beyaz, min: data.depoStok.beyaz[0]?.minStokSeviyesi || 0 },
  ];

  const toplamStokMiktar = toplamStok.Metalik + toplamStok.Mavi + toplamStok.Beyaz;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Hafta {data.haftalikSarfiyat.haftaNo} - Boya Stok Durumu</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Son Güncelleme</p>
          <p className="text-white font-medium">{new Date().toLocaleDateString('tr-TR')}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Günlük Sarfiyat Grafiği */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Günlük Sarfiyat</h3>
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
                <Legend />
                <Bar dataKey="Metalik" fill={BOYA_RENKLERI.Metalik.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Mavi" fill={BOYA_RENKLERI.Mavi.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Beyaz" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Boya Dağılımı */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sarfiyat Dağılımı</h3>
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
                Henüz sarfiyat verisi yok
              </div>
            )}
          </div>
        </div>

        {/* Stok Karşılaştırma */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Stok Durumu vs Minimum Seviye</h3>
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
    </div>
  );
}
