import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { Coffee, Delete, Check } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const [mode, setMode] = useState<'email' | 'pin'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };
  
  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => onLogin(), 300);
      }
    }
  };
  
  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
  };
  
  const handlePinSubmit = () => {
    if (pin.length === 4) {
      onLogin();
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex rounded-lg bg-card border border-border p-1 shadow-sm">
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                language === 'ar' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              AR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                language === 'en' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EN
            </button>
          </div>
        </div>
        
        <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          {/* Logo Section */}
          <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white font-cairo">Demo Cafe</h1>
            <p className="text-white/80 text-sm mt-1">مقهى ديمو</p>
          </div>
          
          <div className="p-6">
            {mode === 'email' ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t('auth.email')}
                  </label>
                  <Input
                    type="email"
                    placeholder="cashier@democafe.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                    dir="ltr"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t('auth.password')}
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base"
                    dir="ltr"
                  />
                </div>
                
                <Button type="submit" size="xl" className="w-full">
                  {t('auth.signIn')}
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground">
                      {t('auth.or')}
                    </span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="xl"
                  className="w-full"
                  onClick={() => setMode('pin')}
                >
                  {t('auth.pinLogin')}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('auth.enterPin')}
                  </h2>
                </div>
                
                {/* PIN Display */}
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                        pin.length > i
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      {pin.length > i ? '•' : ''}
                    </div>
                  ))}
                </div>
                
                {/* PIN Pad */}
                <div className="grid grid-cols-3 gap-3 max-w-[220px] mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <Button
                      key={digit}
                      variant="pin"
                      onClick={() => handlePinInput(digit)}
                    >
                      {digit}
                    </Button>
                  ))}
                  <Button
                    variant="pinDelete"
                    onClick={handlePinDelete}
                    disabled={pin.length === 0}
                  >
                    <Delete className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="pin"
                    onClick={() => handlePinInput('0')}
                  >
                    0
                  </Button>
                  <Button
                    variant="pinAction"
                    onClick={handlePinSubmit}
                    disabled={pin.length !== 4}
                  >
                    <Check className="w-5 h-5" />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setMode('email');
                    setPin('');
                  }}
                >
                  {t('auth.backToEmail')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
