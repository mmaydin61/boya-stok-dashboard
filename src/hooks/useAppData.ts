import { useState, useEffect } from 'react';
import type { AppData, DepoStok, BoyaTipi } from '../types';
import { initialData } from '../data/initialData';

const STORAGE_KEY = 'boya-stok-data-v2';

export function useAppData() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateParametreler = (parametreler: AppData['parametreler']) => {
    setData(prev => ({
      ...prev,
      parametreler,
    }));
  };

  const updateDepoStok = (boyaTipi: BoyaTipi, haftaIndex: number, field: keyof DepoStok, value: number | string) => {
    setData(prev => {
      const keyMap: Record<BoyaTipi, keyof typeof prev.depoStok> = {
        'Metalik': 'metalik',
        'Mavi': 'mavi',
        'Beyaz': 'beyaz',
        'Kırmızı': 'kirmizi',
        'Pembe': 'pembe',
      };
      const key = keyMap[boyaTipi];
      const newStok = [...prev.depoStok[key]];
      const stok = { ...newStok[haftaIndex], [field]: value };

      // Kalan stok hesapla
      stok.kalanStok = stok.baslangicStok + stok.giris - stok.uretimSarfiyat - stok.fireKayip;

      // Durum belirle
      if (stok.kalanStok <= stok.minStokSeviyesi * 0.5) {
        stok.durum = 'Kritik';
      } else if (stok.kalanStok <= stok.minStokSeviyesi) {
        stok.durum = 'Düşük';
      } else {
        stok.durum = 'Normal';
      }

      newStok[haftaIndex] = stok;

      // Sonraki haftanın başlangıç stokunu güncelle
      if (haftaIndex < newStok.length - 1) {
        newStok[haftaIndex + 1] = {
          ...newStok[haftaIndex + 1],
          baslangicStok: stok.kalanStok,
        };
      }

      return {
        ...prev,
        depoStok: {
          ...prev.depoStok,
          [key]: newStok,
        },
      };
    });
  };

  const updateHaftaNo = (haftaNo: number) => {
    setData(prev => ({
      ...prev,
      haftalikSarfiyat: {
        ...prev.haftalikSarfiyat,
        haftaNo,
      },
    }));
  };

  const updateSarfiyat = (
    gunIndex: number,
    kategori: 'pinikKazanlar' | 'evKazanlar' | 'sanayiKazanlar',
    kazanId: string,
    field: 'seviye' | 'sarfiyat',
    value: number | null
  ) => {
    setData(prev => {
      const newGunler = [...prev.haftalikSarfiyat.gunler];
      const gun = { ...newGunler[gunIndex] };
      const kazanSarfiyatlar = [...(gun[kategori] || [])];

      const kazanIndex = kazanSarfiyatlar.findIndex(k => k.kazanId === kazanId);

      if (kazanIndex >= 0) {
        kazanSarfiyatlar[kazanIndex] = {
          ...kazanSarfiyatlar[kazanIndex],
          [field]: value ?? (field === 'sarfiyat' ? 0 : null),
        };
      } else {
        kazanSarfiyatlar.push({
          kazanId,
          seviye: field === 'seviye' ? value : null,
          sarfiyat: field === 'sarfiyat' ? (value ?? 0) : 0,
        });
      }

      gun[kategori] = kazanSarfiyatlar;

      // Günlük toplamı hesapla
      gun.gunlukToplam =
        (gun.pinikKazanlar?.reduce((s, k) => s + (k.sarfiyat || 0), 0) || 0) +
        (gun.evKazanlar?.reduce((s, k) => s + (k.sarfiyat || 0), 0) || 0) +
        (gun.sanayiKazanlar?.reduce((s, k) => s + (k.sarfiyat || 0), 0) || 0);

      newGunler[gunIndex] = gun;

      return {
        ...prev,
        haftalikSarfiyat: {
          ...prev.haftalikSarfiyat,
          gunler: newGunler,
        },
      };
    });
  };

  const resetData = () => {
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Hesaplanmış değerler - Tüm kazanlardan sarfiyat topla
  const toplamHaftalikSarfiyat = data.haftalikSarfiyat.gunler.reduce((acc, gun) => {
    const pinikToplam = gun.pinikKazanlar?.reduce((s, k) => s + k.sarfiyat, 0) || 0;
    const evToplam = gun.evKazanlar?.reduce((s, k) => s + k.sarfiyat, 0) || 0;
    const sanayiToplam = gun.sanayiKazanlar?.reduce((s, k) => s + k.sarfiyat, 0) || 0;
    return acc + pinikToplam + evToplam + sanayiToplam;
  }, 0);

  // Boya bazında sarfiyat hesapla
  const boyaBazindaSarfiyat: Record<BoyaTipi, number> = {
    Metalik: 0,
    Mavi: 0,
    Beyaz: 0,
    Kırmızı: 0,
    Pembe: 0,
  };

  // Her kazan için boya tipine göre sarfiyat topla
  data.haftalikSarfiyat.gunler.forEach(gun => {
    // Pinik kazanları
    gun.pinikKazanlar?.forEach(ks => {
      const kazan = data.parametreler.pinikKazanlar?.find(k => k.id === ks.kazanId);
      if (kazan) {
        boyaBazindaSarfiyat[kazan.boyaTipi] += ks.sarfiyat;
      }
    });
    // Ev kazanları
    gun.evKazanlar?.forEach(ks => {
      const kazan = data.parametreler.evKazanlar?.find(k => k.id === ks.kazanId);
      if (kazan) {
        boyaBazindaSarfiyat[kazan.boyaTipi] += ks.sarfiyat;
      }
    });
    // Sanayi kazanları
    gun.sanayiKazanlar?.forEach(ks => {
      const kazan = data.parametreler.sanayiKazanlar?.find(k => k.id === ks.kazanId);
      if (kazan) {
        boyaBazindaSarfiyat[kazan.boyaTipi] += ks.sarfiyat;
      }
    });
  });

  const toplamStok: Record<BoyaTipi, number> = {
    Metalik: data.depoStok.metalik?.[0]?.kalanStok || 0,
    Mavi: data.depoStok.mavi?.[0]?.kalanStok || 0,
    Beyaz: data.depoStok.beyaz?.[0]?.kalanStok || 0,
    Kırmızı: data.depoStok.kirmizi?.[0]?.kalanStok || 0,
    Pembe: data.depoStok.pembe?.[0]?.kalanStok || 0,
  };

  const kritikStoklar = [
    ...(data.depoStok.metalik?.filter(s => s.durum === 'Kritik' || s.durum === 'Düşük').map(s => ({ ...s, boyaTipi: 'Metalik' as BoyaTipi })) || []),
    ...(data.depoStok.mavi?.filter(s => s.durum === 'Kritik' || s.durum === 'Düşük').map(s => ({ ...s, boyaTipi: 'Mavi' as BoyaTipi })) || []),
    ...(data.depoStok.beyaz?.filter(s => s.durum === 'Kritik' || s.durum === 'Düşük').map(s => ({ ...s, boyaTipi: 'Beyaz' as BoyaTipi })) || []),
    ...(data.depoStok.kirmizi?.filter(s => s.durum === 'Kritik' || s.durum === 'Düşük').map(s => ({ ...s, boyaTipi: 'Kırmızı' as BoyaTipi })) || []),
    ...(data.depoStok.pembe?.filter(s => s.durum === 'Kritik' || s.durum === 'Düşük').map(s => ({ ...s, boyaTipi: 'Pembe' as BoyaTipi })) || []),
  ];

  return {
    data,
    updateParametreler,
    updateDepoStok,
    updateHaftaNo,
    updateSarfiyat,
    resetData,
    toplamHaftalikSarfiyat,
    boyaBazindaSarfiyat,
    toplamStok,
    kritikStoklar,
  };
}
