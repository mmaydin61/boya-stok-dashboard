import { useState } from 'react';
import { RotateCcw, Database, Info, Paintbrush, Save, Plus, Trash2, Factory, Home } from 'lucide-react';
import type { AppData, Kazan, BoyaTipi, KategoriTipi } from '../types';
import { BOYA_RENKLERI } from '../data/initialData';

interface AyarlarProps {
  data: AppData;
  resetData: () => void;
  updateParametreler?: (parametreler: AppData['parametreler']) => void;
}

export function Ayarlar({ data, resetData, updateParametreler }: AyarlarProps) {
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(data.parametreler);

  const handleReset = () => {
    if (window.confirm('Tüm veriler silinecek. Emin misiniz?')) {
      resetData();
    }
  };

  const handleSave = () => {
    if (updateParametreler) {
      updateParametreler(localData);
    }
    setEditMode(false);
  };

  const updateBoyaYogunluk = (tip: BoyaTipi, value: number) => {
    setLocalData(prev => ({
      ...prev,
      boyalar: prev.boyalar.map(b =>
        b.tip === tip ? { ...b, yogunluk: value } : b
      ),
    }));
  };

  const updateKazan = (kategori: 'pinikKazanlar' | 'evKazanlar' | 'sanayiKazanlar', id: string, field: keyof Kazan, value: any) => {
    setLocalData(prev => ({
      ...prev,
      [kategori]: prev[kategori].map(k =>
        k.id === id ? { ...k, [field]: value } : k
      ),
    }));
  };

  const addKazan = (kategori: 'pinikKazanlar' | 'evKazanlar' | 'sanayiKazanlar', kategoriTipi: KategoriTipi) => {
    const prefix = kategori === 'pinikKazanlar' ? 'pik' : kategori === 'evKazanlar' ? 'ev' : 'san';
    const existingIds = localData[kategori].map(k => k.no);
    const newNo = Math.max(...existingIds, 0) + 1;
    const newKazan: Kazan = {
      id: `${prefix}${newNo}`,
      no: newNo,
      kategori: kategoriTipi,
      boyaTipi: 'Metalik',
      cap: 50,
      maksYukseklik: 80,
      kapasite: 150,
      aktif: true,
    };
    setLocalData(prev => ({
      ...prev,
      [kategori]: [...prev[kategori], newKazan],
    }));
  };

  const removeKazan = (kategori: 'pinikKazanlar' | 'evKazanlar' | 'sanayiKazanlar', id: string) => {
    setLocalData(prev => ({
      ...prev,
      [kategori]: prev[kategori].filter(k => k.id !== id),
    }));
  };

  const boyaTipleri: BoyaTipi[] = ['Metalik', 'Mavi', 'Beyaz', 'Kırmızı', 'Pembe'];

  const renderKazanTable = (
    kazanlar: Kazan[],
    kategori: 'pinikKazanlar' | 'evKazanlar' | 'sanayiKazanlar',
    kategoriTipi: KategoriTipi,
    icon: React.ReactNode,
    title: string
  ) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {editMode && (
          <button
            onClick={() => addKazan(kategori, kategoriTipi)}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Kazan Ekle
          </button>
        )}
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2 text-sm font-semibold text-slate-400">No</th>
              <th className="px-4 py-2 text-sm font-semibold text-slate-400">Boya Tipi</th>
              <th className="px-4 py-2 text-sm font-semibold text-slate-400">Çap (cm)</th>
              <th className="px-4 py-2 text-sm font-semibold text-slate-400">Maks. Yükseklik (cm)</th>
              <th className="px-4 py-2 text-sm font-semibold text-slate-400">Kapasite (kg)</th>
              {editMode && <th className="px-4 py-2 text-sm font-semibold text-slate-400">İşlem</th>}
            </tr>
          </thead>
          <tbody>
            {kazanlar.map((kazan) => (
              <tr key={kazan.id} className="border-t border-slate-700/50">
                <td className="px-4 py-3 text-white font-medium">Kazan {kazan.no}</td>
                <td className="px-4 py-3">
                  {editMode ? (
                    <select
                      value={kazan.boyaTipi}
                      onChange={(e) => updateKazan(kategori, kazan.id, 'boyaTipi', e.target.value)}
                      className="bg-slate-700 text-white rounded px-2 py-1 border border-slate-600"
                    >
                      {boyaTipleri.map(tip => (
                        <option key={tip} value={tip}>{tip}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: BOYA_RENKLERI[kazan.boyaTipi]?.primary || '#666' }}
                      />
                      <span className="text-slate-300">{kazan.boyaTipi}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editMode ? (
                    <input
                      type="number"
                      value={kazan.cap}
                      onChange={(e) => updateKazan(kategori, kazan.id, 'cap', Number(e.target.value))}
                      className="bg-slate-700 text-white rounded px-2 py-1 w-20 border border-slate-600"
                    />
                  ) : (
                    <span className="text-slate-400">{kazan.cap}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editMode ? (
                    <input
                      type="number"
                      value={kazan.maksYukseklik}
                      onChange={(e) => updateKazan(kategori, kazan.id, 'maksYukseklik', Number(e.target.value))}
                      className="bg-slate-700 text-white rounded px-2 py-1 w-20 border border-slate-600"
                    />
                  ) : (
                    <span className="text-slate-400">{kazan.maksYukseklik}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editMode ? (
                    <input
                      type="number"
                      value={kazan.kapasite}
                      onChange={(e) => updateKazan(kategori, kazan.id, 'kapasite', Number(e.target.value))}
                      className="bg-slate-700 text-white rounded px-2 py-1 w-20 border border-slate-600"
                    />
                  ) : (
                    <span className="text-white">{kazan.kapasite}</span>
                  )}
                </td>
                {editMode && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeKazan(kategori, kazan.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {kazanlar.length === 0 && (
          <p className="text-center text-slate-500 py-4">Henüz kazan eklenmemiş</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ayarlar</h1>
          <p className="text-slate-400 mt-1">Sistem parametreleri ve veri yönetimi</p>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button
                onClick={() => { setLocalData(data.parametreler); setEditMode(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-colors"
              >
                <Save className="w-4 h-4" />
                Kaydet
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
            >
              Düzenle
            </button>
          )}
        </div>
      </div>

      {/* Boya Parametreleri */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex items-center gap-3">
          <Paintbrush className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Boya Yoğunlukları</h3>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2 text-sm font-semibold text-slate-400">Boya Tipi</th>
                <th className="px-4 py-2 text-sm font-semibold text-slate-400">Renk Kodu</th>
                <th className="px-4 py-2 text-sm font-semibold text-slate-400">Yoğunluk (kg/cm³)</th>
              </tr>
            </thead>
            <tbody>
              {localData.boyalar.map((boya) => (
                <tr key={boya.tip} className="border-t border-slate-700/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: BOYA_RENKLERI[boya.tip]?.primary || '#666' }}
                      />
                      <span className="text-white">{boya.tip}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{boya.renkKodu}</td>
                  <td className="px-4 py-3">
                    {editMode ? (
                      <input
                        type="number"
                        step="0.01"
                        value={boya.yogunluk}
                        onChange={(e) => updateBoyaYogunluk(boya.tip, Number(e.target.value))}
                        className="bg-slate-700 text-white rounded px-2 py-1 w-24 border border-slate-600"
                      />
                    ) : (
                      <span className="text-white">{boya.yogunluk}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pinik Kazanları */}
      {renderKazanTable(
        localData.pinikKazanlar,
        'pinikKazanlar',
        'pinik',
        <Database className="w-5 h-5 text-purple-400" />,
        'Pinik Ünitesi Kazanları'
      )}

      {/* Ev Kazanları */}
      {renderKazanTable(
        localData.evKazanlar,
        'evKazanlar',
        'ev',
        <Home className="w-5 h-5 text-green-400" />,
        'Ev Boyama Ünitesi Kazanları'
      )}

      {/* Sanayi Kazanları */}
      {renderKazanTable(
        localData.sanayiKazanlar,
        'sanayiKazanlar',
        'sanayi',
        <Factory className="w-5 h-5 text-orange-400" />,
        'Sanayi Ünitesi Kazanları'
      )}

      {/* Veri Yönetimi */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Veri Yönetimi</h3>
        </div>
        <p className="text-slate-400 mb-4">
          Tüm veriler tarayıcınızın yerel depolama alanında (LocalStorage) saklanır.
          Aşağıdaki buton ile tüm verileri sıfırlayabilirsiniz.
        </p>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Tüm Verileri Sıfırla
        </button>
      </div>

      {/* Hakkında */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Hakkında</h3>
        </div>
        <div className="space-y-2 text-slate-400">
          <p><strong className="text-white">Uygulama:</strong> Boya Stok Takip Sistemi</p>
          <p><strong className="text-white">Versiyon:</strong> 2.0.0</p>
          <p><strong className="text-white">Teknolojiler:</strong> React, TypeScript, Tailwind CSS, Recharts</p>
          <p className="mt-4 text-sm">
            Bu uygulama boya sarfiyat ve stok takibi için geliştirilmiştir.
            Tüm veriler otomatik olarak kaydedilir.
          </p>
        </div>
      </div>
    </div>
  );
}
