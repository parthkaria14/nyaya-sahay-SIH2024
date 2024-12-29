import { useAtomValue } from 'jotai';
import { useEffect, useState, useCallback } from 'react';
import { currentLanguageAtom, translateText, type LanguageCode } from '@/lib/translation';

interface TranslationOptions {  
  context?: string;
  debounce?: number;
}

export function useTranslation(text: string, options: TranslationOptions = {}) {
  const currentLang = useAtomValue(currentLanguageAtom);
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  const translate = useCallback(
    async (textToTranslate: string, lang: LanguageCode) => {
      if (lang === 'en') {
        setTranslatedText(textToTranslate);
        return;
      }

      setIsLoading(true);
      try {
        const result = await translateText(textToTranslate, lang, options.context);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(textToTranslate);
      } finally {
        setIsLoading(false);
      }
    },
    [options.context]
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (options.debounce) {
      timeoutId = setTimeout(() => {
        translate(text, currentLang);
      }, options.debounce);
    } else {
      translate(text, currentLang);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, currentLang, translate, options.debounce]);

  return { translatedText, isLoading };
}