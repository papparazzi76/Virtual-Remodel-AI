import React from 'react';
import { useTranslation } from '../i18n/config';

interface LoaderProps {
  small?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ small = false }) => {
    const { t } = useTranslation();
    const sizeClasses = small ? 'h-5 w-5 border-2' : 'h-16 w-16 border-4';
    if (small) {
        return (
             <div className={`animate-spin rounded-full ${sizeClasses} border-t-indigo-400 border-r-indigo-400 border-b-gray-600 border-l-gray-600`}></div>
        )
    }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`animate-spin rounded-full ${sizeClasses} border-t-indigo-400 border-r-indigo-400 border-b-gray-600 border-l-gray-600`}></div>
      <p className="text-lg text-gray-300 font-semibold animate-pulse">{t('loader.generating')}</p>
      <p className="text-sm text-gray-500">{t('loader.wait')}</p>
    </div>
  );
};