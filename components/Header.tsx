import React from 'react';
import { useTranslation } from '../i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../hooks/useAuth';
import { SoundToggle } from './SoundToggle';
import { CurrencySwitcher } from './CurrencySwitcher';
import { CreditIcon } from './icons/CreditIcon';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isDemo, exitDemoMode, openPricingModal } = useAuth();

  return (
    <>
      <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex-1">
             <h1 className="text-xl md:text-3xl font-bold text-left text-white tracking-wider">
               <span className="text-indigo-400">{t('appTitle.virtual')}</span> {t('appTitle.remodelAI')}
             </h1>
          </div>
         
          <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">
            {isDemo && (
              <button
                onClick={exitDemoMode}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-lg text-xs md:text-sm transition-colors"
              >
                {t('demo.exit')}
              </button>
            )}
            {user && (
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-1.5 bg-gray-900/50 px-3 py-1.5 rounded-full text-sm">
                    <CreditIcon className="w-5 h-5 text-amber-400" />
                    <span className="font-semibold text-white">{user.credits}</span>
                    <span className="text-gray-400 hidden sm:inline">{t('header.credits')}</span>
                  </div>
                   <button
                    onClick={openPricingModal}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-3 rounded-lg text-xs md:text-sm transition-colors"
                  >
                    {t('header.upgrade')}
                  </button>
                  <span className="hidden lg:block text-sm text-gray-300">{user.email}</span>
                  <button 
                    onClick={logout}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-lg text-xs md:text-sm transition-colors"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
            )}
            <SoundToggle />
            <CurrencySwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};