
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/config';
import { useSound } from '../context/SoundContext';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useTranslation();
  const { playClick } = useSound();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'es', label: 'ES' },
    { code: 'de', label: 'DE' },
    { code: 'it', label: 'IT' },
    { code: 'pt', label: 'PT' },
  ] as const;

  type LocaleCode = typeof languages[number]['code'];

  const handleLocaleChange = (code: LocaleCode) => {
    playClick();
    setLocale(code);
    setIsOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 w-20 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{languages.find((lang) => lang.code === locale)?.label}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-20 py-1 ring-1 ring-black ring-opacity-5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLocaleChange(lang.code)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                locale === lang.code
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-600/50'
              }`}
              role="menuitem"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
