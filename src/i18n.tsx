import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Lang = 'si' | 'en';

const STORAGE_KEY = 'invitation-lang';

function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'en' || fromUrl === 'si') return fromUrl;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'si') return saved;
  } catch {
    /* storage unavailable */
  }
  return 'si';
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Pick the Sinhala or English variant for the current language. */
  t: <T,>(si: T, en: T) => T;
}

const LangContext = createContext<LangContextValue>({
  lang: 'si',
  setLang: () => {},
  t: (si) => si,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(<T,>(si: T, en: T) => (lang === 'si' ? si : en), [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Gold pill switch: සිං | EN */
export function LanguageToggle({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  const { lang, setLang } = useLang();

  const btn = (value: Lang, label: string, font: string) => {
    const active = lang === value;
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={(e) => {
          e.stopPropagation();
          setLang(value);
        }}
        className="rounded-full px-3 py-1 text-[0.78rem] font-semibold transition-colors cursor-pointer"
        style={{
          fontFamily: font,
          background: active ? 'linear-gradient(135deg, #7E8F6E, #627254)' : 'transparent',
          color: active ? '#F9F6F0' : '#4F5D43',
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      role="group"
      aria-label="Invitation language"
      className={`flex items-center gap-0.5 rounded-full p-1 ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(98, 114, 84, 0.4)',
        boxShadow: '0 10px 24px -12px rgba(98,114,84,0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        ...style,
      }}
    >
      {btn('si', 'සිං', 'var(--font-sinhala)')}
      {btn('en', 'EN', '"Montserrat", sans-serif')}
    </div>
  );
}
