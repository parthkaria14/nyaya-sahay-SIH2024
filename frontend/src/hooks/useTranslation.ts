import { useAtomValue } from 'jotai';
import { useEffect, useState, useCallback, useRef } from 'react';
import { currentLanguageAtom, translateText, type LanguageCode } from '@/lib/translation';

interface TranslationOptions {
  context?: string;
  debounce?: number;
}

export function useTranslation(text: string, options: TranslationOptions = {}) {
  const currentLang = useAtomValue(currentLanguageAtom);
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const translationTimeout = useRef<NodeJS.Timeout>();

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
    if (translationTimeout.current) {
      clearTimeout(translationTimeout.current);
    }

    if (options.debounce) {
      translationTimeout.current = setTimeout(() => {
        translate(text, currentLang);
      }, options.debounce);
    } else {
      translate(text, currentLang);
    }

    return () => {
      if (translationTimeout.current) {
        clearTimeout(translationTimeout.current);
      }
    };
  }, [text, currentLang, translate, options.debounce]);

  return { translatedText, isLoading };
}