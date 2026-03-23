import { useEffect } from 'react';
import { useTranslation } from './useTranslation';

const SEO_STRINGS = {
  it: {
    lang:        'it',
    title:       'Diario ABC — Diario delle Emozioni',
    description: 'Identifica e traccia le tue emozioni con la Ruota delle Emozioni. Uno strumento terapeutico digitale per il benessere emotivo, privato e sicuro.',
    ogTitle:     'Diario ABC — Diario delle Emozioni',
    ogDesc:      'Identifica e traccia le tue emozioni con la Ruota delle Emozioni. Privato, sicuro, tutto sul tuo dispositivo.',
    twitterTitle:'Diario ABC — Diario delle Emozioni',
    twitterDesc: 'Identifica e traccia le tue emozioni con la Ruota delle Emozioni.',
  },
  en: {
    lang:        'en',
    title:       'ABC Diary — Emotion Journal',
    description: 'Identify and track your emotions with the Emotion Wheel. A digital therapeutic tool for emotional wellbeing, private and secure.',
    ogTitle:     'ABC Diary — Emotion Journal',
    ogDesc:      'Identify and track your emotions with the Emotion Wheel. Private, secure, everything stays on your device.',
    twitterTitle:'ABC Diary — Emotion Journal',
    twitterDesc: 'Identify and track your emotions with the Emotion Wheel.',
  },
};

export function useSEO() {
    
  const { locale } = useTranslation();

  useEffect(() => {
    const s = SEO_STRINGS[locale] ?? SEO_STRINGS.it;
    document.documentElement.lang = s.lang;
    document.title = s.title;
    const setMeta = (selector, content) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };
    setMeta('meta[name="description"]', s.description);
    setMeta('meta[property="og:title"]', s.ogTitle);
    setMeta('meta[property="og:description"]', s.ogDesc);
    setMeta('meta[name="twitter:title"]', s.twitterTitle);
    setMeta('meta[name="twitter:description"]', s.twitterDesc);
  }, [locale]);
}