import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { Dashboard } from './pages/Dashboard';
import { Sarfiyat } from './pages/Sarfiyat';
import { Stok } from './pages/Stok';
import { Rapor } from './pages/Rapor';
import { Ayarlar } from './pages/Ayarlar';
import { useAppData } from './hooks/useAppData';
import { useAuth } from './hooks/useAuth';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const {
    data,
    updateParametreler,
    updateDepoStok,
    updateHaftaNo,
    resetData,
    toplamHaftalikSarfiyat,
    boyaBazindaSarfiyat,
    toplamStok,
    kritikStoklar,
  } = useAppData();

  const { isAuthenticated, isLoading, login, logout, updateActivity } = useAuth();

  // Update activity on user interaction
  useEffect(() => {
    const handleActivity = () => updateActivity();
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [updateActivity]);

  // Handle admin click
  const handleAdminClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      setActivePage('ayarlar');
    }
  };

  // Handle successful login
  const handleLogin = (password: string): boolean => {
    const success = login(password);
    if (success) {
      setActivePage('ayarlar');
    }
    return success;
  };

  // Handle page change
  const handlePageChange = (page: string) => {
    if (page === 'ayarlar' && !isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setActivePage(page);
  };

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
        // Double-check authentication for ayarlar
        if (!isAuthenticated) {
          setShowLoginModal(true);
          setActivePage('dashboard');
          return null;
        }
        return <Ayarlar data={data} resetData={resetData} updateParametreler={updateParametreler} />;
      default:
        return null;
    }
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        isAuthenticated={isAuthenticated}
        onAdminClick={handleAdminClick}
        onLogout={logout}
      />
      <main className="flex-1 ml-64 p-8">
        {renderPage()}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
