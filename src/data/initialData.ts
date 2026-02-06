import type { AppData, BoyaTipi } from '../types';

// Günler için boş sarfiyat şablonu
const createEmptyGunler = () => [
  'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'
].map(gun => ({
  gun,
  pinikKazanlar: [
    { kazanId: 'pik1', seviye: null, sarfiyat: 0 },
    { kazanId: 'pik2', seviye: null, sarfiyat: 0 },
    { kazanId: 'pik3', seviye: null, sarfiyat: 0 },
  ],
  evKazanlar: [
    { kazanId: 'ev1', seviye: null, sarfiyat: 0 },
    { kazanId: 'ev2', seviye: null, sarfiyat: 0 },
    { kazanId: 'ev3', seviye: null, sarfiyat: 0 },
  ],
  sanayiKazanlar: [
    { kazanId: 'san1', seviye: null, sarfiyat: 0 },
    { kazanId: 'san2', seviye: null, sarfiyat: 0 },
    { kazanId: 'san3', seviye: null, sarfiyat: 0 },
    { kazanId: 'san4', seviye: null, sarfiyat: 0 },
  ],
  gunlukToplam: 0,
}));

// Haftalık stok şablonu
const createHaftalikStok = (baslangic: number, min: number) => [1, 2, 3, 4].map(i => ({
  hafta: `Hafta ${i}`,
  baslangicStok: baslangic,
  giris: 0,
  uretimSarfiyat: 0,
  fireKayip: 0,
  kalanStok: baslangic,
  minStokSeviyesi: min,
  durum: 'Normal' as const,
}));

export const initialData: AppData = {
  parametreler: {
    boyalar: [
      { tip: 'Metalik', renkKodu: 'MET', yogunluk: 1.05, aktif: true },
      { tip: 'Mavi', renkKodu: 'MAV', yogunluk: 1.15, aktif: true },
      { tip: 'Beyaz', renkKodu: 'BYZ', yogunluk: 1.20, aktif: true },
      { tip: 'Kırmızı', renkKodu: 'KRM', yogunluk: 1.18, aktif: true },
      { tip: 'Pembe', renkKodu: 'PMB', yogunluk: 1.12, aktif: true },
    ],
    pinikKazanlar: [
      { id: 'pik1', no: 1, kategori: 'pinik', boyaTipi: 'Metalik', cap: 50, maksYukseklik: 80, kapasite: 165, aktif: true },
      { id: 'pik2', no: 2, kategori: 'pinik', boyaTipi: 'Mavi', cap: 50, maksYukseklik: 80, kapasite: 181, aktif: true },
      { id: 'pik3', no: 3, kategori: 'pinik', boyaTipi: 'Beyaz', cap: 50, maksYukseklik: 80, kapasite: 188, aktif: true },
    ],
    evKazanlar: [
      { id: 'ev1', no: 1, kategori: 'ev', boyaTipi: 'Metalik', cap: 40, maksYukseklik: 60, kapasite: 120, aktif: true },
      { id: 'ev2', no: 2, kategori: 'ev', boyaTipi: 'Mavi', cap: 40, maksYukseklik: 60, kapasite: 130, aktif: true },
      { id: 'ev3', no: 3, kategori: 'ev', boyaTipi: 'Beyaz', cap: 40, maksYukseklik: 60, kapasite: 140, aktif: true },
    ],
    sanayiKazanlar: [
      { id: 'san1', no: 1, kategori: 'sanayi', boyaTipi: 'Metalik', cap: 60, maksYukseklik: 100, kapasite: 250, aktif: true },
      { id: 'san2', no: 2, kategori: 'sanayi', boyaTipi: 'Mavi', cap: 60, maksYukseklik: 100, kapasite: 270, aktif: true },
      { id: 'san3', no: 3, kategori: 'sanayi', boyaTipi: 'Kırmızı', cap: 60, maksYukseklik: 100, kapasite: 260, aktif: true },
      { id: 'san4', no: 4, kategori: 'sanayi', boyaTipi: 'Pembe', cap: 60, maksYukseklik: 100, kapasite: 240, aktif: true },
    ],
  },
  haftalikSarfiyat: {
    haftaNo: 1,
    tarihAraligi: '',
    gunler: createEmptyGunler(),
  },
  depoStok: {
    metalik: createHaftalikStok(500, 200),
    mavi: createHaftalikStok(400, 150),
    beyaz: createHaftalikStok(600, 250),
    kirmizi: createHaftalikStok(350, 150),
    pembe: createHaftalikStok(300, 100),
  },
  ozetRapor: [
    { boyaTipi: 'Metalik', buHafta: 0, hedef: 300, fark: -300, yuzde: 0 },
    { boyaTipi: 'Mavi', buHafta: 0, hedef: 250, fark: -250, yuzde: 0 },
    { boyaTipi: 'Beyaz', buHafta: 0, hedef: 350, fark: -350, yuzde: 0 },
    { boyaTipi: 'Kırmızı', buHafta: 0, hedef: 200, fark: -200, yuzde: 0 },
    { boyaTipi: 'Pembe', buHafta: 0, hedef: 150, fark: -150, yuzde: 0 },
  ],
};

export const BOYA_RENKLERI: Record<BoyaTipi, { primary: string; secondary: string; bg: string }> = {
  Metalik: { primary: '#94a3b8', secondary: '#64748b', bg: 'rgba(148, 163, 184, 0.1)' },
  Mavi: { primary: '#3b82f6', secondary: '#2563eb', bg: 'rgba(59, 130, 246, 0.1)' },
  Beyaz: { primary: '#f1f5f9', secondary: '#e2e8f0', bg: 'rgba(241, 245, 249, 0.1)' },
  Kırmızı: { primary: '#ef4444', secondary: '#dc2626', bg: 'rgba(239, 68, 68, 0.1)' },
  Pembe: { primary: '#ec4899', secondary: '#db2777', bg: 'rgba(236, 72, 153, 0.1)' },
};

export const KATEGORI_ISIMLERI = {
  pinik: 'Pinik Ünitesi',
  ev: 'Ev Boyama Ünitesi',
  sanayi: 'Sanayi Ünitesi',
};
