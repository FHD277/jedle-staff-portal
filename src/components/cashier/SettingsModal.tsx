import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Volume2, Printer, Globe, Monitor } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function SettingsModal({
  open,
  onClose,
  soundEnabled,
  onToggleSound,
}: SettingsModalProps) {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⚙️ {t('settings.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Sound Settings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Volume2 className="w-4 h-4" />
              {t('settings.sound')}
            </div>
            <div className="bg-muted/30 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('settings.enableSound')}</span>
                <Switch checked={soundEnabled} onCheckedChange={onToggleSound} />
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">{t('settings.volume')}</span>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  disabled={!soundEnabled}
                  className="w-full"
                />
              </div>
            </div>
          </section>
          
          {/* Printing Settings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Printer className="w-4 h-4" />
              {t('settings.printing')}
            </div>
            <div className="bg-muted/30 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('settings.autoPrint')}</span>
                <Switch defaultChecked />
              </div>
            </div>
          </section>
          
          {/* Language Settings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Globe className="w-4 h-4" />
              {t('settings.language')}
            </div>
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  checked={language === 'ar'}
                  onChange={() => setLanguage('ar')}
                  className="w-4 h-4 text-primary"
                />
                <span>العربية (Arabic)</span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                  className="w-4 h-4 text-primary"
                />
                <span>English</span>
              </label>
            </div>
          </section>
          
          {/* Display Settings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Monitor className="w-4 h-4" />
              {language === 'ar' ? 'العرض' : 'Display'}
            </div>
            <div className="bg-muted/30 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {language === 'ar' ? 'إظهار الطلبات المكتملة' : 'Show completed orders'}
                </span>
                <Switch />
              </div>
            </div>
          </section>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={onClose}>
            {t('settings.save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
