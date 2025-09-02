import React from 'react';
import { useTranslation } from '../i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LANDING_PAGE_SAMPLES, PRICING_PLANS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { CheckIcon } from './icons/CheckIcon';
import { useCurrency } from '../context/CurrencyContext';

interface LandingPageProps {
    onLoginClick: () => void;
    onDemoClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onDemoClick }) => {
    const { t } = useTranslation();
    const { getFormattedPrice } = useCurrency();

    const features = [
        {
            icon: SparklesIcon,
            title: t('landing.feature1Title'),
            text: t('landing.feature1Text'),
        },
        {
            icon: PhotoIcon,
            title: t('landing.feature2Title'),
            text: t('landing.feature2Text'),
        },
        {
            icon: CheckIcon,
            title: t('landing.feature3Title'),
            text: t('landing.feature3Text'),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
                        <span className="text-indigo-400">{t('appTitle.virtual')}</span> {t('appTitle.remodelAI')}
                    </h1>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                         <a 
                            href="#pricing" 
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="hidden sm:block text-gray-300 hover:text-white font-bold py-2 px-4 text-sm transition-colors"
                        >
                            {t('header.pricing')}
                        </a>
                        <button 
                            onClick={onLoginClick}
                            className="hidden sm:block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                            {t('auth.loginButton')}
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden">
                    <img
                        src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920"
                        alt="Background of a modern remodeled living room"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
                    />
                    <div className="absolute inset-0 bg-gray-900/50 z-1"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            {t('landing.heroTitle')}
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
                           {t('landing.heroSubtitle')}
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={onLoginClick}
                                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                            >
                                {t('landing.ctaRegister')}
                            </button>
                            <button
                                onClick={onDemoClick}
                                className="w-full sm:w-auto bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white font-semibold py-3 px-8 border-2 border-gray-600 hover:border-gray-500 rounded-lg text-lg transition-colors"
                            >
                                {t('landing.ctaDemo')}
                            </button>
                        </div>
                    </div>
                </section>
                
                {/* Before & After Gallery */}
                <section className="py-20 bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl md:text-4xl font-bold text-indigo-400">{t('landing.galleryTitle')}</h3>
                            <p className="mt-2 text-lg text-gray-400">{t('landing.gallerySubtitle')}</p>
                        </div>
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                            {/* Left Column: Before Images */}
                            <div className="space-y-8">
                                <h4 className="text-2xl font-bold text-center text-gray-400 uppercase tracking-wider">{t('display.original')}</h4>
                                {LANDING_PAGE_SAMPLES.map(sample => (
                                    <div key={`before-${sample.id}`}>
                                        <p className="text-md font-medium mb-2 text-center text-gray-300">{t(sample.labelKey)}</p>
                                        <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden ring-1 ring-gray-700 shadow-lg">
                                            <img src={sample.beforeSrc} alt={`${t(sample.labelKey)} ${t('display.original')}`} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Right Column: After Images */}
                            <div className="space-y-8">
                                <h4 className="text-2xl font-bold text-center text-indigo-400 uppercase tracking-wider">{t('display.remodeled')}</h4>
                                {LANDING_PAGE_SAMPLES.map(sample => (
                                    <div key={`after-${sample.id}`}>
                                        <p className="text-md font-medium mb-2 text-center text-gray-300">{t(sample.labelKey)}</p>
                                        <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden ring-1 ring-gray-700 shadow-lg">
                                            <img src={sample.afterSrc} alt={`${t(sample.labelKey)} ${t('display.remodeled')}`} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-gray-800/50">
                    <div className="container mx-auto px-4 text-center">
                        <h3 className="text-3xl md:text-4xl font-bold mb-12">{t('landing.featuresTitle')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-gray-800 p-8 rounded-lg">
                                    <feature.icon className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
                                    <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                                    <p className="text-gray-400">{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                 {/* Pricing Section */}
                <section id="pricing" className="py-20 bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl md:text-4xl font-bold">{t('landing.pricingTitle')}</h3>
                            <p className="mt-2 text-lg text-gray-400 max-w-3xl mx-auto">{t('landing.pricingSubtitle')}</p>
                        </div>

                        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {PRICING_PLANS.map(plan => (
                                <div key={plan.id} className={`bg-gray-800 rounded-lg p-8 flex flex-col relative ${plan.isPopular ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-700'}`}>
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
                                            onClick={onLoginClick}
                                            className="mt-auto pt-4 w-full rounded-md bg-indigo-600 px-3 py-3 text-center text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                           {t(plan.ctaKey)}
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
                    </div>
                </section>

                 {/* Final CTA Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4 text-center">
                         <h3 className="text-3xl md:text-4xl font-bold">{t('landing.finalCtaTitle')}</h3>
                         <button
                            onClick={onLoginClick}
                            className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform transform hover:scale-105"
                        >
                            {t('landing.finalCtaButton')}
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 py-6">
                 <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} {t('appTitle.virtual')} {t('appTitle.remodelAI')}. All Rights Reserved.
                 </div>
            </footer>
        </div>
    );
};

export default LandingPage;