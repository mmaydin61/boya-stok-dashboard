import { useState } from 'react';
import { Package, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import type { AppData, DepoStok, BoyaTipi } from '../types';
import { BOYA_RENKLERI } from '../data/initialData';

interface StokProps {
  data: AppData;
  updateDepoStok: (boyaTipi: BoyaTipi, haftaIndex: number, field: keyof DepoStok, value: number | string) => void;
}

type TabType = 'Metalik' | 'Mavi' | 'Beyaz';

export function Stok({ data, updateDepoStok }: StokProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Metalik');

  const tabs: TabType[] = ['Metalik', 'Mavi', 'Beyaz'];

  const getStokData = (tip: TabType) => {
    switch (tip) {
      case 'Metalik':
        return data.depoStok.metalik;
      case 'Mavi':
        return data.depoStok.mavi;
      case 'Beyaz':
        return data.depoStok.beyaz;
    }
  };

  const handleInputChange = (
    haftaIndex: number,
    field: keyof DepoStok,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    updateDepoStok(activeTab, haftaIndex, field, numValue);
  };

  const stokData = getStokData(activeTab);
  const renkler = BOYA_RENKLERI[activeTab];

  const toplamGiris = stokData.reduce((acc, s) => acc + s.giris, 0);
  const toplamSarfiyat = stokData.reduce((acc, s) => acc + s.uretimSarfiyat, 0);
  const toplamFire = stokData.reduce((acc, s) => acc + s.fireKayip, 0);

  const getDurumBadge = (durum: string) => {
    switch (durum) {
      case 'Normal':
        return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Normal</span>;
      case 'Düşük':
        return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Düşük</span>;
      case 'Kritik':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1 pulse-warning"><AlertTriangle className="w-3 h-3" /> Kritik</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Depo Stok Takibi</h1>
          <p className="text-slate-400 mt-1">Haftalık stok giriş, çıkış ve durum takibi</p>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-slate-400" />
          <span className="text-slate-400">Aylık Görünüm</span>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: BOYA_RENKLERI[tab].primary }}
            />
            {tab} Boya
          </button>
        ))}
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Package className="w-4 h-4" />
            Mevcut Stok
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stokData[0]?.kalanStok.toFixed(1) || 0} kg</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            Toplam Giriş
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{toplamGiris.toFixed(1)} kg</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <TrendingDown className="w-4 h-4" />
            Toplam Sarfiyat
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{toplamSarfiyat.toFixed(1)} kg</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            Fire/Kayıp
          </div>
          <p className="text-2xl font-bold text-red-400 mt-2">{toplamFire.toFixed(1)} kg</p>
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: renkler.primary }}
          />
          <h3 className="text-lg font-semibold text-white">{activeTab} Boya Stok Tablosu</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Hafta</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300">Başlangıç Stok (kg)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300">Giriş (kg)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300">Üretim Sarfiyat (kg)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300">Fire/Kayıp (kg)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300">Kalan Stok (kg)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300">Min. Seviye</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300">Durum</th>
              </tr>
            </thead>
            <tbody>
              {stokData.map((stok, index) => (
                <tr
                  key={stok.hafta}
                  className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                    stok.durum === 'Kritik' ? 'bg-red-500/5' : stok.durum === 'Düşük' ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-white font-medium">{stok.hafta}</td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      step="0.1"
                      value={stok.baslangicStok || ''}
                      onChange={(e) => handleInputChange(index, 'baslangicStok', e.target.value)}
                      className="w-24 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={index > 0}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      step="0.1"
                      value={stok.giris || ''}
                      onChange={(e) => handleInputChange(index, 'giris', e.target.value)}
                      className="w-24 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      step="0.1"
                      value={stok.uretimSarfiyat || ''}
                      onChange={(e) => handleInputChange(index, 'uretimSarfiyat', e.target.value)}
                      className="w-24 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      step="0.1"
                      value={stok.fireKayip || ''}
                      onChange={(e) => handleInputChange(index, 'fireKayip', e.target.value)}
                      className="w-24 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-lg font-bold ${
                      stok.kalanStok <= stok.minStokSeviyesi * 0.5
                        ? 'text-red-400'
                        : stok.kalanStok <= stok.minStokSeviyesi
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {stok.kalanStok.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      step="1"
                      value={stok.minStokSeviyesi || ''}
                      onChange={(e) => handleInputChange(index, 'minStokSeviyesi', e.target.value)}
                      className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-center focus:outline-none focus:ring-1 focus:ring-slate-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getDurumBadge(stok.durum)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bilgi */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-blue-400 text-sm">
          💡 <strong>İpucu:</strong> Kalan stok otomatik hesaplanır: Başlangıç + Giriş - Sarfiyat - Fire.
          Sonraki haftanın başlangıç stoğu, önceki haftanın kalan stoğundan otomatik aktarılır.
        </p>
      </div>
    </div>
  );
}
