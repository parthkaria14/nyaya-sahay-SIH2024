import { atom } from 'jotai';
// import translate from '@vitalets/google-translate-api';

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
] as const;

export type LanguageCode = typeof supportedLanguages[number]['code'];

export const currentLanguageAtom = atom<LanguageCode>('en');

// Translation cache
const translationCache = new Map<string, Map<LanguageCode, string>>();

export async function translateText(
  text: string,
  targetLang: LanguageCode,
  context?: string
): Promise<string> {
  if (targetLang === 'en') return text;

  // Check cache
  const cachedTranslations = translationCache.get(text);
  if (cachedTranslations?.has(targetLang)) {
    return cachedTranslations.get(targetLang)!;
  }

  try {
    const response = await translate(text, { to: targetLang });
    const translation = response.text;

    // Cache translation
    if (!translationCache.has(text)) {
      translationCache.set(text, new Map());
    }
    translationCache.get(text)!.set(targetLang, translation);

    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}