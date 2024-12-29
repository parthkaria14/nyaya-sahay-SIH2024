import { useAtom } from 'jotai';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { currentLanguageAtom, supportedLanguages } from '@/lib/translation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import i18n from '@/lib/i18n';

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useAtom(currentLanguageAtom);

  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && supportedLanguages.some(lang => lang.code === savedLang)) {
      setCurrentLang(savedLang as any);
      i18n.changeLanguage(savedLang); // Update i18n language
    }
  }, [setCurrentLang]);

  const handleLanguageChange = async (newLang: string) => {
    setCurrentLang(newLang as any);
    localStorage.setItem('preferred-language', newLang);
    i18n.changeLanguage(newLang); // Update i18n language

    const langName = supportedLanguages.find(lang => lang.code === newLang)?.name;
    toast.success(`Language changed to ${langName}`, {
      duration: 2000,
    });
  };

  return (
    <Select value={currentLang} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          {supportedLanguages.find(lang => lang.code === currentLang)?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}