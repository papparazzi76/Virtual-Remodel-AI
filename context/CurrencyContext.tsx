import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP';

// Simple, approximate rates for demonstration
const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
};

const SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  getFormattedPrice: (priceUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('EUR');

  const getFormattedPrice = useCallback((priceUSD: number): string => {
    const rate = RATES[currency];
    const symbol = SYMBOLS[currency];
    const convertedPrice = Math.round(priceUSD * rate);
    return `${symbol}${convertedPrice}`;
  }, [currency]);
  
  const value = { currency, setCurrency, getFormattedPrice };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};