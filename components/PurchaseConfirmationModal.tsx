
import React from 'react';
import { useTranslation } from '../i18n/config';
import { CheckIcon } from './icons/CheckIcon';
import { useSound } from '../context/SoundContext';

interface PurchaseConfirmationModalProps {
  creditsAdded: number;
  newTotal: number;
  onClose: () => void;
}

const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({ creditsAdded, newTotal, onClose }) => {
  const { t } = useTranslation();
  const { playSuccess } = useSound();

  React.useEffect(() => {
    playSuccess();
  }, [playSuccess]);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 text-white rounded-xl shadow-2xl max-w-md w-full mx-auto p-8 text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <CheckIcon className="h-10 w-10 text-green-400" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-white">{t('purchaseConfirmation.title')}</h2>
        <p className="mt-3 text-gray-300">
          {t('purchaseConfirmation.message').replace('{count}', creditsAdded.toString())}
        </p>
        <p className="mt-2 text-lg font-semibold text-indigo-300">
          {t('purchaseConfirmation.totalCredits').replace('{count}', newTotal.toString())}
        </p>
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('purchaseConfirmation.cta')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmationModal;
