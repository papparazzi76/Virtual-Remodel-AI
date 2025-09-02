import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { useTranslation } from '../i18n/config';
import { ImageComparator } from './ImageComparator';

interface ImageDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  onDownload: () => void;
  isDemo: boolean;
}

const ImageCard: React.FC<{ title: string; imageSrc: string | null }> = ({ title, imageSrc }) => {
    const { t } = useTranslation();
    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold text-center mb-3 text-gray-300">{title}</h3>
            <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden ring-1 ring-gray-700">
                {imageSrc ? (
                     <img src={imageSrc} alt={title} className="w-full h-full object-contain" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">{t('display.awaiting')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, generatedImage, onDownload, isDemo }) => {
  const { t } = useTranslation();

  if (!originalImage) {
    return null;
  }
  
  return (
    <div className="w-full flex flex-col items-center">
      
      {generatedImage ? (
        <ImageComparator beforeSrc={originalImage} afterSrc={generatedImage} />
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageCard title={t('display.original')} imageSrc={originalImage} />
            <ImageCard title={t('display.remodeled')} imageSrc={null} />
        </div>
      )}

      {!isDemo && generatedImage && (
        <button
          onClick={onDownload}
          className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2 text-lg"
        >
          <DownloadIcon className="w-5 h-5" />
          {t('display.download')}
        </button>
      )}
    </div>
  );
};