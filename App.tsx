
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { LanguageProvider, useTranslation } from './i18n/config';
import AuthPage from './components/auth/AuthPage';
import MainApp from './MainApp';
import PricingPage from './components/pricing/PricingPage';
import { Loader } from './components/Loader';
import LandingPage from './components/LandingPage';
import { CurrencyProvider } from './context/CurrencyContext';
import { SoundProvider } from './context/SoundContext';
import PurchaseConfirmationModal from './components/PurchaseConfirmationModal';

const AppRouter: React.FC = () => {
    const { 
      isAuthenticated, 
      isLoading,
      isDemo, 
      enterDemoMode,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal 
    } = useAuth();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
                <Loader />
                <p className="mt-4 text-lg text-gray-300">{t('auth.loadingSession')}</p>
            </div>
        );
    }

    if (isDemo) {
      return <MainApp />;
    }

    if (!isAuthenticated) {
        return (
          <>
            <LandingPage onLoginClick={openAuthModal} onDemoClick={enterDemoMode} />
            {isAuthModalOpen && <AuthPage onClose={closeAuthModal} />}
          </>
        );
    }
    
    return <MainApp />;
};


const App: React.FC = () => {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <SoundProvider>
            <AppContent />
          </SoundProvider>
        </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
};

const AppContent: React.FC = () => {
    const { 
        isPricingModalOpen, 
        openPricingModal, 
        closePricingModal, 
        user, 
        snoozeTrialReminder,
        purchaseConfirmation,
        hidePurchaseConfirmation
    } = useAuth();
    const { t } = useTranslation();
    
    // Check if the user is a guest and has run out of initial credits.
    const isTrialOver = user?.role === 'Guest' && user.credits <= 0;

    React.useEffect(() => {
        const snoozeUntil = localStorage.getItem('trialSnoozeUntil');
        // Check if snooze time exists and is in the future
        const isSnoozed = snoozeUntil && new Date().getTime() < parseInt(snoozeUntil, 10);

        if (snoozeUntil && !isSnoozed) {
            // Clean up expired snooze key
            localStorage.removeItem('trialSnoozeUntil');
        }

        // Automatically open the pricing modal if the trial is over and not snoozed.
        if (isTrialOver && !isSnoozed && !isPricingModalOpen) {
            openPricingModal();
        }
    }, [isTrialOver, isPricingModalOpen, openPricingModal, user]); // Rerun check if user or modal state changes
    
    const handleRemindLater = () => {
        // This function will set the localstorage key and close the modal
        snoozeTrialReminder();
    };

    return (
        <>
            <AppRouter />
            {isPricingModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4" 
                    onClick={closePricingModal}
                    aria-modal="true"
                    role="dialog"
                >
                    <div onClick={e => e.stopPropagation()}>
                        <PricingPage
                          onClose={closePricingModal}
                          title={isTrialOver ? t('pricing.trialExpiredTitle') : undefined}
                          message={isTrialOver ? t('pricing.trialExpiredMessage') : undefined}
                          isTrialExpired={isTrialOver}
                          onRemindLater={handleRemindLater}
                        />
                    </div>
                </div>
            )}
             {purchaseConfirmation && user && (
                <PurchaseConfirmationModal
                    creditsAdded={purchaseConfirmation.creditsAdded}
                    newTotal={user.credits}
                    onClose={hidePurchaseConfirmation}
                />
            )}
        </>
    );
};

export default App;