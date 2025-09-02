
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../i18n/config';
import { Loader } from '../Loader';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import { useCurrency } from '../../context/CurrencyContext';
import { PRICING_PLANS } from '../../constants';

interface PricingPageProps {
  onClose?: () => void;
  title?: string;
  message?: string;
  isTrialExpired?: boolean;
  onRemindLater?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onClose, title, message, isTrialExpired, onRemindLater }) => {
    const { purchaseCredits } = useAuth();
    const { t } = useTranslation();
    const { getFormattedPrice } = useCurrency();
    const [isLoading, setIsLoading] = useState<string | null>(null); // Track loading state by plan ID
    const [error, setError] = useState<string | null>(null);

    const handlePurchase = async (planId: string, credits: number) => {
        setIsLoading(planId);
        setError(null);
        try {
            await purchaseCredits(credits);
            if(onClose) onClose();
        } catch (err) {
            setError(t('pricing.genericError'));
        } finally {
            setIsLoading(null);
        }
    };
    
    return (
        <div className="bg-gray-800 text-white rounded-xl shadow-2xl max-w-5xl w-full mx-auto">
            <div className="w-full text-center p-8 relative">
                {onClose && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" aria-label="Close">
                        <XIcon className="w-6 h-6" />
                    </button>
                )}

                {title && message && (
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-amber-400">{title}</h1>
                        <p className="text-gray-300 mt-2">{message}</p>
                    </div>
                )}

                <h2 className="text-4xl font-extrabold text-indigo-400">{t('pricing.title')}</h2>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">{t('pricing.description')}</p>

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {PRICING_PLANS.map(plan => (
                        <div key={plan.id} className={`bg-gray-900/50 rounded-lg p-8 flex flex-col relative ${plan.isPopular ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-700'}`}>
                            {plan.isPopular && (
                                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                                    <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">{t('pricing.mostPopular')}</span>
                                </div>
                            )}
                            <h3 className="text-2xl font-bold">{t(plan.nameKey)}</h3>
                            <p className="mt-2 text-gray-400">{t(plan.creditsKey)}</p>
                            <div className="mt-6 flex items-baseline justify-center gap-x-2">
                                <span className="text-5xl font-bold tracking-tight text-white">
                                    {plan.priceUSD !== null ? getFormattedPrice(plan.priceUSD) : t('pricing.enterprisePlanPrice')}
                                </span>
                            </div>
                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300 text-left">
                               {t(plan.featuresKey).split(';').map((feature, index) => (
                                 <li key={index} className="flex gap-x-3">
                                    <CheckIcon className="h-6 w-5 flex-none text-indigo-400" />
                                    {feature.trim()}
                                </li>
                               ))}
                            </ul>
                            
                            {plan.ctaAction === 'purchase' ? (
                                <button
                                    onClick={() => handlePurchase(plan.id, plan.credits)}
                                    disabled={!!isLoading}
                                    className="mt-auto pt-4 w-full rounded-md bg-indigo-600 px-3 py-3 text-center text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-900 disabled:cursor-not-allowed flex items-center justify-center min-h-[56px]"
                                >
                                   {isLoading === plan.id ? <Loader small /> : t(plan.ctaKey)}
                                </button>
                            ) : (
                                <a
                                    href="mailto:sales@virtualremodelai.com"
                                    className="mt-auto pt-4 block w-full rounded-md bg-gray-600 px-3 py-3 text-center text-lg font-semibold text-white shadow-sm hover:bg-gray-500"
                                >
                                   {t(plan.ctaKey)}
                                </a>
                            )}
                        </div>
                   ))}
                </div>
                 {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
                 {isLoading && <p className="mt-4 text-sm text-gray-400">{t('pricing.processing')}</p>}

                 {isTrialExpired && onRemindLater && (
                    <div className="mt-6 text-center">
                        <button
                          onClick={onRemindLater}
                          className="text-sm text-gray-400 hover:text-white underline transition-colors"
                        >
                          {t('pricing.remindLaterButton')}
                        </button>
                    </div>
                 )}
            </div>
        </div>
    );
};


export default PricingPage;