import React from 'react';
import { useCurrency, Currency } from '../context/CurrencyContext';
import { useSound } from '../context/SoundContext';

export const CurrencySwitcher: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const { playClick } = useSound();

  const currencies: Currency[] = ['USD', 'EUR', 'GBP'];

  const handleCurrencyChange = (code: Currency) => {
    playClick();
    setCurrency(code);
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-700 rounded-md p-0.5">
      {currencies.map((curr) => (
        <button
          key={curr}
          onClick={() => handleCurrencyChange(curr)}
          className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-md transition-colors duration-200 ${
            currency === curr
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-600/50'
          }`}
          aria-pressed={currency === curr}
        >
          {curr}
        </button>
      ))}
    </div>
  );
};
