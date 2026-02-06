// Boya Tipi - Genişletilmiş
export type BoyaTipi = 'Metalik' | 'Mavi' | 'Beyaz' | 'Kırmızı' | 'Pembe';

// Kategori Tipi
export type KategoriTipi = 'pinik' | 'ev' | 'sanayi';

// Boya Parametreleri
export interface BoyaParametre {
  tip: BoyaTipi;
  renkKodu: string;
  yogunluk: number;
  aktif: boolean;
}

// Kazan
export interface Kazan {
  id: string;
  no: number;
  kategori: KategoriTipi;
  boyaTipi: BoyaTipi;
  cap: number;
  maksYukseklik: number;
  kapasite: number;
  aktif: boolean;
}

// Günlük Sarfiyat - Dinamik yapı
export interface KazanSarfiyat {
  kazanId: string;
  seviye: number | null;
  sarfiyat: number;
}

export interface GunlukSarfiyat {
  gun: string;
  pinikKazanlar: KazanSarfiyat[];
  evKazanlar: KazanSarfiyat[];
  sanayiKazanlar: KazanSarfiyat[];
  gunlukToplam: number;
}

// Haftalık Sarfiyat
export interface HaftalikSarfiyat {
  haftaNo: number;
  tarihAraligi: string;
  gunler: GunlukSarfiyat[];
}

// Depo Stok
export interface DepoStok {
  hafta: string;
  baslangicStok: number;
  giris: number;
  uretimSarfiyat: number;
  fireKayip: number;
  kalanStok: number;
  minStokSeviyesi: number;
  durum: 'Normal' | 'Düşük' | 'Kritik';
}

// Depo Stok Tablosu - Genişletilmiş
export interface DepoStokTablo {
  metalik: DepoStok[];
  mavi: DepoStok[];
  beyaz: DepoStok[];
  kirmizi: DepoStok[];
  pembe: DepoStok[];
}

// Özet Rapor
export interface OzetRapor {
  boyaTipi: BoyaTipi;
  buHafta: number;
  hedef: number;
  fark: number;
  yuzde: number;
}

// Ana Uygulama Verisi
export interface AppData {
  parametreler: {
    boyalar: BoyaParametre[];
    pinikKazanlar: Kazan[];
    evKazanlar: Kazan[];
    sanayiKazanlar: Kazan[];
  };
  haftalikSarfiyat: HaftalikSarfiyat;
  depoStok: DepoStokTablo;
  ozetRapor: OzetRapor[];
}
