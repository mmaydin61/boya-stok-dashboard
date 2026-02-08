import { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff, Shield, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Lock countdown
  useEffect(() => {
    if (lockTime > 0) {
      const timer = setTimeout(() => setLockTime(lockTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isLocked && lockTime === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [lockTime, isLocked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) return;

    // Sanitize input
    const sanitizedPassword = password.trim();

    if (!sanitizedPassword) {
      setError('Şifre boş olamaz');
      return;
    }

    const success = onLogin(sanitizedPassword);

    if (success) {
      setPassword('');
      setError('');
      setAttempts(0);
      onClose();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError('Hatalı şifre');
      setPassword('');

      // Lock after 5 failed attempts
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTime(30); // 30 seconds lockout
        setError('Çok fazla hatalı deneme. 30 saniye bekleyin.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Admin Girişi</h2>
          <p className="text-blue-100 text-sm mt-1">Ayarlara erişmek için şifre girin</p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Admin Şifresi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-slate-400" />
              </div>
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={isLocked}
                placeholder="••••••"
                className="w-full pl-10 pr-12 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {error}
              {isLocked && lockTime > 0 && (
                <span className="ml-auto font-mono">{lockTime}s</span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLocked || !password}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLocked ? `Kilitli (${lockTime}s)` : 'Giriş Yap'}
          </button>

          {attempts > 0 && !isLocked && (
            <p className="text-center text-slate-500 text-xs">
              {5 - attempts} deneme hakkınız kaldı
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
