import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { atom } from 'jotai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
] as const;

export type LanguageCode = typeof supportedLanguages[number]['code'];

export const currentLanguageAtom = atom<LanguageCode>('en');

// Cache for translated texts
const translationCache = new Map<string, Map<LanguageCode, string>>();

export async function translateText(
  text: string,
  targetLang: LanguageCode,
  context?: string
): Promise<string> {
  if (targetLang === 'en') return text;

  // Check cache first
  const cachedTranslations = translationCache.get(text);
  if (cachedTranslations?.has(targetLang)) {
    return cachedTranslations.get(targetLang)!;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Translate the following text to ${targetLang}${
      context ? ` (Context: ${context})` : ''
    }:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const translation = result.response.text();

    // Cache the translation
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

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        message_copied: 'Message copied to clipboard',
        copy_failed: 'Failed to copy message',
        download_link_not_available: 'Download link not available',
        download_failed: 'Failed to download document',
        view_less: 'View Less',
        read_more: 'Read More',
        captcha: 'CAPTCHA',
        case_status: 'Case Status',
        file_size_exceeds_limit: 'File size exceeds 10MB limit',
        file_uploaded_successfully: 'File uploaded successfully',
        speech_recognition_not_supported: 'Speech recognition is not supported in your browser',
        listening_speak_now: 'Listening... Speak now',
        speech_recognition_error: 'Error occurred in speech recognition',
        microphone_access_denied: 'Microphone access denied',
        loading_captcha_invalid_response: 'Loading Captcha: Invalid response',
        loading_captcha_failed: 'Loading CAPTCHA...',
        please_fill_all_fields: 'Please fill in all fields',
        case_status_retrieved_successfully: 'Case status retrieved successfully',
        failed_to_fetch_case_status: 'Failed to fetch case status',
        nyaya_sahay_assistant: 'Nyaya Sahay Assistant',
        your_legal_guide: 'Your Legal Guide',
        how_can_i_help_you_today: 'How can I help you today?',
        general_query: 'General Query',
        templates: 'Templates',
        ask_any_legal_questions: 'Ask any legal questions',
        get_legal_document_templates: 'Get legal document templates',
        check_your_case_status: 'Check your case status',
        type_your_message: 'Type your message...',
        enter_cnr_number: 'Enter CNR Number',
        enter_captcha: 'Enter CAPTCHA',
        submit: 'Submit',
        loading: 'Loading...',
        court_streaming: 'Court Streaming',
        tele_law: 'Tele Law',
        legal_aid: 'Legal Aid',
        navigate_to_case_status: 'Navigate to Case Status',
        navigate_to_court_streaming: 'Navigate to Court Streaming',
        navigate_to_tele_law: 'Navigate to Tele Law',
        navigate_to_templates: 'Navigate to Templates',
        navigate_to_legal_aid: 'Navigate to Legal Aid',
      },
    },
    hi: {
      translation: {
        message_copied: 'संदेश क्लिपबोर्ड पर कॉपी किया गया',
        copy_failed: 'संदेश कॉपी करने में विफल',
        download_link_not_available: 'डाउनलोड लिंक उपलब्ध नहीं है',
        download_failed: 'दस्तावेज़ डाउनलोड करने में विफल',
        view_less: 'कम देखें',
        read_more: 'और पढ़ें',
        captcha: 'कैप्चा',
        case_status: 'केस स्थिति',
        file_size_exceeds_limit: 'फ़ाइल का आकार 10MB से अधिक है',
        file_uploaded_successfully: 'फ़ाइल सफलतापूर्वक अपलोड की गई',
        speech_recognition_not_supported: 'आपके ब्राउज़र में वाक्य पहचान समर्थित नहीं है',
        listening_speak_now: 'सुन रहा है... अब बोलें',
        speech_recognition_error: 'वाक्य पहचान में त्रुटि हुई',
        microphone_access_denied: 'माइक्रोफ़ोन एक्सेस अस्वीकृत',
        loading_captcha_invalid_response: 'कैप्चा लोड करने में अमान्य प्रतिक्रिया',
        loading_captcha_failed: 'कैप्चा लोड हो रहा है...',
        please_fill_all_fields: 'कृपया सभी फ़ील्ड भरें',
        case_status_retrieved_successfully: 'केस स्थिति सफलतापूर्वक प्राप्त की गई',
        failed_to_fetch_case_status: 'केस स्थिति प्राप्त करने में विफल',
        nyaya_sahay_assistant: 'न्याय सहाय सहायक',
        your_legal_guide: 'आपका कानूनी गाइड',
        how_can_i_help_you_today: 'आज मैं आपकी कैसे मदद कर सकता हूँ?',
        templates: 'टेम्प्लेट्स',
        ask_any_legal_questions: 'कोई भी कानूनी प्रश्न पूछें',
        get_legal_document_templates: 'कानूनी दस्तावेज़ टेम्प्लेट्स प्राप्त करें',
        check_your_case_status: 'अपनी केस स्थिति जांचें',
        type_your_message: 'अपना संदेश टाइप करें...',
        enter_cnr_number: 'CNR नंबर दर्ज करें',
        enter_captcha: 'कैप्चा दर्ज करें',
        submit: 'जमा करें',
        loading: 'लोड हो रहा है...',
        general_query: 'सामान्य प्रश्न',
        court_streaming: 'कोर्ट स्ट्रीमिंग',
        tele_law: 'टेली लॉ',
        legal_aid: 'कानूनी सहायता',
        navigate_to_case_status: 'केस स्थिति पर जाएं',
        navigate_to_court_streaming: 'कोर्ट स्ट्रीमिंग पर जाएं',
        navigate_to_tele_law: 'टेली लॉ पर जाएं',
        navigate_to_templates: 'टेम्प्लेट्स पर जाएं',
        navigate_to_legal_aid: 'कानूनी सहायता पर जाएं',
      },
    },
    mr: {
      translation: {
        message_copied: 'संदेश क्लिपबोर्डवर कॉपी केला',
        copy_failed: 'संदेश कॉपी करण्यात अपयश',
        download_link_not_available: 'डाउनलोड लिंक उपलब्ध नाही',
        download_failed: 'दस्तऐवज डाउनलोड करण्यात अपयश',
        view_less: 'कमी पहा',
        read_more: 'अधिक वाचा',
        captcha: 'कॅपचा',
        case_status: 'केस स्थिती',
        file_size_exceeds_limit: 'फाइलचा आकार 10MB पेक्षा जास्त आहे',
        file_uploaded_successfully: 'फाइल यशस्वीरित्या अपलोड केली',
        speech_recognition_not_supported: 'आपल्या ब्राउझरमध्ये वाणी ओळख समर्थित नाही',
        listening_speak_now: 'ऐकत आहे... आता बोला',
        speech_recognition_error: 'वाणी ओळखामध्ये त्रुटी',
        microphone_access_denied: 'मायक्रोफोन प्रवेश नाकारला',
        loading_captcha_invalid_response: 'कॅपचा लोड करण्यात अवैध प्रतिसाद',
        loading_captcha_failed: 'कॅपचा लोड होत आहे...',
        please_fill_all_fields: 'कृपया सर्व फील्ड भरा',
        case_status_retrieved_successfully: 'केस स्थिती यशस्वीरित्या मिळाली',
        failed_to_fetch_case_status: 'केस स्थिती मिळवण्यात अपयश',
        nyaya_sahay_assistant: 'न्याय सहाय सहायक',
        your_legal_guide: 'तुमचा कायदेशीर मार्गदर्शक',
        how_can_i_help_you_today: 'आज मी तुम्हाला कसे मदत करू शकतो?',
        general_query: 'सामान्य प्रश्न',
        templates: 'टेम्प्लेट्स',
        ask_any_legal_questions: 'कोणतेही कायदेशीर प्रश्न विचारा',
        get_legal_document_templates: 'कायदेशीर दस्तऐवज टेम्प्लेट्स मिळवा',
        check_your_case_status: 'तुमची केस स्थिती तपासा',
        type_your_message: 'तुमचा संदेश टाइप करा...',
        enter_cnr_number: 'CNR क्रमांक टाका',
        enter_captcha: 'कॅपचा टाका',
        submit: 'सबमिट करा',
        loading: 'लोड होत आहे...',
        court_streaming: 'कोर्ट स्ट्रीमिंग',
        tele_law: 'टेली लॉ',
        legal_aid: 'कानूनी मदत',
        navigate_to_case_status: 'केस स्थिती वर जा',
        navigate_to_court_streaming: 'कोर्ट स्ट्रीमिंग वर जा',
        navigate_to_tele_law: 'टेली लॉ वर जा',
        navigate_to_templates: 'टेम्प्लेट्स वर जा',
        navigate_to_legal_aid: 'कानूनी मदत वर जा',
      },
    },
    kn: {
      translation: {
        message_copied: 'ಸಂದೇಶವನ್ನು ನಕಲಿಸಲಾಗಿದೆ',
        copy_failed: 'ಸಂದೇಶವನ್ನು ನಕಲಿಸುವಲ್ಲಿ ವಿಫಲವಾಗಿದೆ',
        download_link_not_available: 'ಡೌನ್ಲೋಡ್ ಲಿಂಕ್ ಲಭ್ಯವಿಲ್ಲ',
        download_failed: 'ದಸ್ತಾವೇಜು ಡೌನ್ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ವಿಫಲವಾಗಿದೆ',
        view_less: 'ಕಡಿಮೆ ನೋಡಿ',
        read_more: 'ಇನ್ನಷ್ಟು ಓದಿ',
        captcha: 'ಕ್ಯಾಪ್ಚಾ',
        case_status: 'ವಿಚಾರಣೆಯ ಸ್ಥಿತಿ',
        file_size_exceeds_limit: 'ಫೈಲ್ ಗಾತ್ರವು 10MB ಮಿತಿಯನ್ನು ಮೀರಿದೆ',
        file_uploaded_successfully: 'ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ',
        speech_recognition_not_supported: 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತು ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ',
        listening_speak_now: 'ಕೇಳುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ',
        speech_recognition_error: 'ಮಾತು ಗುರುತಿಸುವಿಕೆಯಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ',
        microphone_access_denied: 'ಮೈಕ್ರೋಫೋನ್ ಪ್ರವೇಶವನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ',
        loading_captcha_invalid_response: 'ಕ್ಯಾಪ್ಚಾ ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ಅಮಾನ್ಯ ಪ್ರತಿಕ್ರಿಯೆ',
        loading_captcha_failed: 'ಕ್ಯಾಪ್ಚಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        please_fill_all_fields: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಫಿಲ್ಡ್‌ಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ',
        case_status_retrieved_successfully: 'ವಿಚಾರಣೆಯ ಸ್ಥಿತಿ ಯಶಸ್ವಿಯಾಗಿ ಪಡೆಯಲಾಗಿದೆ',
        failed_to_fetch_case_status: 'ವಿಚಾರಣೆಯ ಸ್ಥಿತಿಯನ್ನು ಪಡೆಯುವಲ್ಲಿ ವಿಫಲವಾಗಿದೆ',
        nyaya_sahay_assistant: 'ನ್ಯಾಯ ಸಹಾಯ ಸಹಾಯಕ',
        your_legal_guide: 'ನಿಮ್ಮ ಕಾನೂನು ಮಾರ್ಗದರ್ಶಿ',
        how_can_i_help_you_today: 'ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
        general_query: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆ',
        templates: 'ಟೆಂಪ್ಲೇಟ್‌ಗಳು',
        ask_any_legal_questions: 'ಯಾವುದೇ ಕಾನೂನು ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ',
        get_legal_document_templates: 'ಕಾನೂನು ದಸ್ತಾವೇಜು ಟೆಂಪ್ಲೇಟ್‌ಗಳನ್ನು ಪಡೆಯಿರಿ',
        check_your_case_status: 'ನಿಮ್ಮ ವಿಚಾರಣೆಯ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ',
        type_your_message: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...',
        enter_cnr_number: 'CNR ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
        enter_captcha: 'ಕ್ಯಾಪ್ಚಾ ನಮೂದಿಸಿ',
        submit: 'ಸಲ್ಲಿಸಿ',
        loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        court_streaming: 'ನ್ಯಾಯಾಲಯ ಸ್ಟ್ರೀಮಿಂಗ್',
        tele_law: 'ಟೆಲಿ ಕಾನೂನು',
        legal_aid: 'ಕಾನೂನು ಸಹಾಯ',
        navigate_to_case_status: 'ವಿಚಾರಣೆಯ ಸ್ಥಿತಿಗೆ ಹೋಗಿ',
        navigate_to_court_streaming: 'ನ್ಯಾಯಾಲಯ ಸ್ಟ್ರೀಮಿಂಗ್‌ಗೆ ಹೋಗಿ',
        navigate_to_tele_law: 'ಟೆಲಿ ಕಾನೂನುಗೆ ಹೋಗಿ',
        navigate_to_templates: 'ಟೆಂಪ್ಲೇಟ್‌ಗಳಿಗೆ ಹೋಗಿ',
        navigate_to_legal_aid: 'ಕಾನೂನು ಸಹಾಯಕ್ಕೆ ಹೋಗಿ',
      },
    },
    gu: {
      translation: {
        message_copied: 'સંદೇશ ક્લિપબોર્ડ પર નકલ થયો',
        copy_failed: 'સંદೇશ નકલ કરવામાં નિષ್ફળ',
        download_link_not_available: 'ડાઉનલોડ લિંક ઉપલબ્ધ નથી',
        download_failed: 'દસ್તાવેજ ડાઉનલોડ કરવામાં નિષ್ફળ',
        view_less: 'ઓછુ જુઓ',
        read_more: 'વધુ વાંચો',
        captcha: 'કૅપચા',
        case_status: 'કેસ સ્થિતિ',
        file_size_exceeds_limit: 'ફાઇલ કદ 10MB ની મર્યાદા વટાવી છે',
        file_uploaded_successfully: 'ફાઇલ સફળતાપૂર્વક અપલોડ થઈ',
        speech_recognition_not_supported: 'તમારા બ્રાઉઝરમાં વાક્ય ઓળખ સપોર્ટેડ નથી',
        listening_speak_now: 'સાંભળી રહ્યું છે... હવે બોલો',
        speech_recognition_error: 'વાક્ય ઓળખમાં ભૂલ આવી',
        microphone_access_denied: 'માઈક્રોફોન ઍક્સેસ નામંજૂર થયો',
        loading_captcha_invalid_response: 'કૅપચા લોડ કરવામાં અમાન્ય પ્રતિભાવ',
        loading_captcha_failed: 'કૅપચા લોડ થઈ રહ્યું છે...',
        please_fill_all_fields: 'મહેરબાની કરી બધા ફીલ્ડ ભરો',
        case_status_retrieved_successfully: 'કેસ સ્થિતિ સફળતાપૂર્વક મેળવી',
        failed_to_fetch_case_status: 'કેસ સ્થિતિ મેળવવામાં નિષ್ફળ',
        nyaya_sahay_assistant: 'ન્યાય સહાય સહાયક',
        your_legal_guide: 'તમારો કાનૂની માર્ગદર્શક',
        how_can_i_help_you_today: 'આજે હું તમને કેવી રીતે મદદ કરી શકું?',
        general_query: 'સામાન્ય પ્રશ્ન',
        templates: 'ટેમ્પ્લેટ્સ',
        ask_any_legal_questions: 'કોઈપણ કાનૂની પ્રશ્નો પૂછો',
        get_legal_document_templates: 'કાનૂની દસ્તાવેજ ટેમ્પ્લેટ્સ મેળવો',
        check_your_case_status: 'તમારી કેસ સ્થિતિ તપાસો',
        type_your_message: 'તમારો સંદೇશ ટાઇપ કરો...',
        enter_cnr_number: 'CNR નંબર દાખલ કરો',
        enter_captcha: 'કૅપચા દાખલ કરો',
        submit: 'સબમિટ કરો',
        loading: 'લોડ થઈ રહ્યું છે...',
        court_streaming: 'કોર્ટ સ્ટ્રીમિંગ',
        tele_law: 'ટેલિ કાનૂન',
        legal_aid: 'કાનૂની મદદ',
        navigate_to_case_status: 'કેસ સ્થિતિ પર જાવ',
        navigate_to_court_streaming: 'કોર્ટ સ્ટ્રીમિંગ પર જાવ',
        navigate_to_tele_law: 'ટેલિ કાનૂન પર જાવ',
        navigate_to_templates: 'ટેમ્પ્લેટ્સ પર જાવ',
        navigate_to_legal_aid: 'કાનૂની મદદ પર જાવ',
      },
    },
    // Add other languages here
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;