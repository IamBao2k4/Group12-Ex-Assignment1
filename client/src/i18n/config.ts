import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

// Danh sách ngôn ngữ được hỗ trợ
export const supportedLngs = {
  en: "English",
  vi: "Tiếng Việt",
  zh: "中文",
  ru: "Русский",
};

i18n
  // Load translation files từ server
  .use(HttpApi)
  // Tự động phát hiện ngôn ngữ người dùng
  .use(LanguageDetector)
  // Kết nối với React
  .use(initReactI18next)
  .init({
    // Ngôn ngữ mặc định khi không phát hiện được
    fallbackLng: "vi",
    
    // Danh sách ngôn ngữ được hỗ trợ
    supportedLngs: Object.keys(supportedLngs),
    
    // Debug mode (tắt khi production)
    debug: process.env.NODE_ENV === 'development',
    
    // Namespace mặc định
    ns: ["translation"],
    defaultNS: "translation",
    
    // Backend options - nơi load các file translation
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    
    // Language detector options
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    
    interpolation: {
      escapeValue: false, // React đã escape XSS
    },
    
    react: {
      useSuspense: true,
    },
  });

export default i18n; 