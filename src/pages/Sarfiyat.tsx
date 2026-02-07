import { useState, useEffect } from 'react';
import { Factory, Home, Database, Calculator } from 'lucide-react';
import type { AppData, Kazan, BoyaTipi } from '../types';
import { BOYA_RENKLERI } from '../data/initialData';

interface SarfiyatProps {
  data: AppData;
  updateHaftaNo: (haftaNo: number) => void;
}

interface KazanSeviye {
  pazartesi: number | null;
  cuma: number | null;
}

export function Sarfiyat({ data, updateHaftaNo }: SarfiyatProps) {
  // Her kazan için Pazartesi ve Cuma seviyeleri
  const [seviyeler, setSeviyeler] = useState<Record<string, KazanSeviye>>({});

  // Hesaplanan sarfiyatlar
  const [hesaplananlar, setHesaplananlar] = useState<Record<string, { sarfiyat: number; mevcutKg: number }>>({});

  // Kazan için hesaplama yap
  const hesaplaSarfiyat = (kazan: Kazan, pazartesiSeviye: number | null, cumaSeviye: number | null) => {
    if (pazartesiSeviye === null || cumaSeviye === null) {
      return { sarfiyat: 0, mevcutKg: 0 };
    }

    const boyaParam = data.parametreler.boyalar.find(b => b.tip === kazan.boyaTipi);
    const yogunluk = boyaParam?.yogunluk || 1.0;
    const yaricap = kazan.cap / 2;

    // Mevcut boya miktarı (Cuma seviyesine göre)
    const mevcutHacim = Math.PI * Math.pow(yaricap, 2) * cumaSeviye;
    const mevcutKg = (mevcutHacim * yogunluk) / 1000;

    // Haftalık sarfiyat (fark)
    const fark = pazartesiSeviye - cumaSeviye;
    if (fark <= 0) {
      return { sarfiyat: 0, mevcutKg };
    }

    const sarfiyatHacim = Math.PI * Math.pow(yaricap, 2) * fark;
    const sarfiyat = (sarfiyatHacim * yogunluk) / 1000;

    return { sarfiyat, mevcutKg };
  };

  // Seviye değiştiğinde hesapla
  const handleSeviyeChange = (kazanId: string, gun: 'pazartesi' | 'cuma', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setSeviyeler(prev => ({
      ...prev,
      [kazanId]: {
        ...prev[kazanId],
        [gun]: numValue,
      },
    }));
  };

  // Hesaplamaları güncelle
  useEffect(() => {
    const yeniHesaplar: Record<string, { sarfiyat: number; mevcutKg: number }> = {};

    const tumKazanlar = [
      ...data.parametreler.pinikKazanlar,
      ...data.parametreler.evKazanlar,
      ...data.parametreler.sanayiKazanlar,
    ];

    tumKazanlar.forEach(kazan => {
      const seviye = seviyeler[kazan.id] || { pazartesi: null, cuma: null };
      yeniHesaplar[kazan.id] = hesaplaSarfiyat(kazan, seviye.pazartesi, seviye.cuma);
    });

    setHesaplananlar(yeniHesaplar);
  }, [seviyeler, data.parametreler]);

  // Kategori bazında toplam
  const kategoriToplam = (kazanlar: Kazan[]) => {
    return kazanlar.reduce((acc, k) => acc + (hesaplananlar[k.id]?.sarfiyat || 0), 0);
  };

  // Boya tipi bazında toplam
  const boyaBazindaToplam = (boyaTipi: BoyaTipi) => {
    const tumKazanlar = [
      ...data.parametreler.pinikKazanlar,
      ...data.parametreler.evKazanlar,
      ...data.parametreler.sanayiKazanlar,
    ].filter(k => k.boyaTipi === boyaTipi);

    return tumKazanlar.reduce((acc, k) => acc + (hesaplananlar[k.id]?.sarfiyat || 0), 0);
  };

  // Genel toplam
  const genelToplam = Object.values(hesaplananlar).reduce((acc, h) => acc + h.sarfiyat, 0);

  const renderKazanTable = (
    kazanlar: Kazan[],
    icon: React.ReactNode,
    title: string,
    bgColor: string
  ) => {
    if (!kazanlar || kazanlar.length === 0) return null;

    const toplam = kategoriToplam(kazanlar);

    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className={`p-4 border-b border-slate-700/50 ${bgColor} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <span className="text-lg font-bold text-emerald-400">{toplam.toFixed(1)} kg</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300 border-b border-slate-700">
                  Kazan
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300 border-b border-slate-700">
                  Boya Tipi
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300 border-b border-slate-700">
                  Çap (cm)
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-blue-400 border-b border-slate-700">
                  Pazartesi Seviye (cm)
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-orange-400 border-b border-slate-700">
                  Cuma Seviye (cm)
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-cyan-400 border-b border-slate-700">
                  Mevcut (kg)
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-emerald-400 border-b border-slate-700">
                  Haftalık Sarfiyat (kg)
                </th>
              </tr>
            </thead>
            <tbody>
              {kazanlar.map((kazan) => {
                const seviye = seviyeler[kazan.id] || { pazartesi: null, cuma: null };
                const hesap = hesaplananlar[kazan.id] || { sarfiyat: 0, mevcutKg: 0 };

                return (
                  <tr key={kazan.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">Kazan {kazan.no}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: BOYA_RENKLERI[kazan.boyaTipi]?.primary || '#666' }}
                        />
                        <span className="text-slate-300">{kazan.boyaTipi}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-400">{kazan.cap}</td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={seviye.pazartesi ?? ''}
                        onChange={(e) => handleSeviyeChange(kazan.id, 'pazartesi', e.target.value)}
                        className="w-20 px-2 py-1 bg-blue-900/30 border border-blue-500/50 rounded text-blue-300 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={seviye.cuma ?? ''}
                        onChange={(e) => handleSeviyeChange(kazan.id, 'cuma', e.target.value)}
                        className="w-20 px-2 py-1 bg-orange-900/30 border border-orange-500/50 rounded text-orange-300 text-sm text-center focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-cyan-400 font-medium">{hesap.mevcutKg.toFixed(1)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${hesap.sarfiyat > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {hesap.sarfiyat.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Haftalık Sarfiyat Hesaplama</h1>
          <p className="text-slate-400 mt-1">Pazartesi ve Cuma seviyelerini girin, sarfiyat otomatik hesaplansın</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-slate-400 text-sm">Hafta No:</label>
            <input
              type="number"
              value={data.haftalikSarfiyat.haftaNo}
              onChange={(e) => updateHaftaNo(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-xl border border-emerald-500/30 p-4">
          <p className="text-emerald-400 text-xs">Haftalık Toplam</p>
          <p className="text-2xl font-bold text-white mt-1">{genelToplam.toFixed(1)} kg</p>
        </div>
        {(['Metalik', 'Mavi', 'Beyaz', 'Kırmızı', 'Pembe'] as BoyaTipi[]).map(tip => {
          const toplam = boyaBazindaToplam(tip);
          if (toplam === 0 && !data.parametreler.pinikKazanlar.some(k => k.boyaTipi === tip) &&
              !data.parametreler.evKazanlar.some(k => k.boyaTipi === tip) &&
              !data.parametreler.sanayiKazanlar.some(k => k.boyaTipi === tip)) {
            return null;
          }
          return (
            <div
              key={tip}
              className="rounded-xl border p-4"
              style={{
                background: `linear-gradient(135deg, ${BOYA_RENKLERI[tip]?.bg || 'rgba(100,100,100,0.1)'}, transparent)`,
                borderColor: `${BOYA_RENKLERI[tip]?.primary || '#666'}50`,
              }}
            >
              <p className="text-xs" style={{ color: BOYA_RENKLERI[tip]?.primary }}>{tip}</p>
              <p className="text-xl font-bold text-white mt-1">{toplam.toFixed(1)} kg</p>
            </div>
          );
        })}
      </div>

      {/* Pinik Kazanları */}
      {renderKazanTable(
        data.parametreler.pinikKazanlar,
        <Database className="w-5 h-5 text-purple-400" />,
        'Pinik Ünitesi',
        'bg-purple-500/10'
      )}

      {/* Ev Kazanları */}
      {renderKazanTable(
        data.parametreler.evKazanlar,
        <Home className="w-5 h-5 text-green-400" />,
        'Ev Boyama Ünitesi',
        'bg-green-500/10'
      )}

      {/* Sanayi Kazanları */}
      {renderKazanTable(
        data.parametreler.sanayiKazanlar,
        <Factory className="w-5 h-5 text-orange-400" />,
        'Sanayi Ünitesi',
        'bg-orange-500/10'
      )}

      {/* Formül Bilgisi */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Hesaplama Formülü</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-400 mb-2">Mevcut Boya Miktarı:</p>
            <code className="text-cyan-400">kg = π × (çap/2)² × cuma_seviye × yoğunluk / 1000</code>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-400 mb-2">Haftalık Sarfiyat:</p>
            <code className="text-emerald-400">kg = π × (çap/2)² × (pzt_seviye - cuma_seviye) × yoğunluk / 1000</code>
          </div>
        </div>
      </div>
    </div>
  );
}
