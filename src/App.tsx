import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Sarfiyat } from './pages/Sarfiyat';
import { Stok } from './pages/Stok';
import { Rapor } from './pages/Rapor';
import { Ayarlar } from './pages/Ayarlar';
import { useAppData } from './hooks/useAppData';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const {
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
  } = useAppData();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            data={data}
            toplamHaftalikSarfiyat={toplamHaftalikSarfiyat}
            boyaBazindaSarfiyat={boyaBazindaSarfiyat}
            toplamStok={toplamStok}
            kritikStoklar={kritikStoklar}
          />
        );
      case 'sarfiyat':
        return (
          <Sarfiyat
            data={data}
            updateSarfiyat={updateSarfiyat}
            updateHaftaNo={updateHaftaNo}
          />
        );
      case 'stok':
        return <Stok data={data} updateDepoStok={updateDepoStok} />;
      case 'rapor':
        return (
          <Rapor
            data={data}
            boyaBazindaSarfiyat={boyaBazindaSarfiyat}
            toplamStok={toplamStok}
          />
        );
      case 'ayarlar':
        return <Ayarlar data={data} resetData={resetData} updateParametreler={updateParametreler} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 ml-64 p-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
