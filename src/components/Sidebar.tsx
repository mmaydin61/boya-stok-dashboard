import { LayoutDashboard, Droplets, Warehouse, FileBarChart, Settings, Paintbrush } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sarfiyat', label: 'Haftalık Sarfiyat', icon: Droplets },
  { id: 'stok', label: 'Depo Stok', icon: Warehouse },
  { id: 'rapor', label: 'Özet Rapor', icon: FileBarChart },
  { id: 'ayarlar', label: 'Ayarlar', icon: Settings },
];

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Paintbrush className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Boya Stok</h1>
            <p className="text-xs text-slate-400">Takip Sistemi</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="px-4 py-3 rounded-xl bg-slate-800/50">
          <p className="text-xs text-slate-500">Versiyon 1.0</p>
          <p className="text-xs text-slate-400 mt-1">Veriler otomatik kaydedilir</p>
        </div>
      </div>
    </aside>
  );
}
