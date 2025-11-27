import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enJSON from "./en.json";
import plJSON from "./pl.json";
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    debug: false,

    resources: {
      en: { ...enJSON },
      pl: { ...plJSON },
    },
  });

export default i18n;
