import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { useTranslation } from '../i18n/config';
import { SAMPLE_IMAGES } from '../constants';
import { Loader } from './Loader';
import { useSound } from '../context/SoundContext';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

type SampleImage = typeof SAMPLE_IMAGES[number];

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);
  const { t } = useTranslation();
  const { playClick } = useSound();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleUploaderClick = () => {
    playClick();
    document.getElementById('file-upload')?.click();
  };

  const handleSampleClick = useCallback(async (sample: SampleImage) => {
    playClick();
    setLoadingSample(sample.id);
    try {
      const response = await fetch(sample.src);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const blob = await response.blob();
      
      const fileName = sample.src.split('/').pop()?.split('?')[0] ?? `${sample.id}.jpeg`;

      const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });

      onImageUpload(file);
    } catch (error) {
      console.error("Failed to load sample image:", error);
      setLoadingSample(null);
    }
  }, [onImageUpload, playClick]);

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-gray-700/50' : 'border-gray-600 hover:border-indigo-500 hover:bg-gray-700/30'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={handleUploaderClick}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center">
          <UploadIcon className="w-12 h-12 text-gray-500 mb-4" />
          <p className="font-semibold text-gray-300">
            <span className="text-indigo-400">{t('imageUploader.upload')}</span> {t('imageUploader.dragAndDrop')}
          </p>
          <p className="text-xs text-gray-500 mt-1">{t('imageUploader.fileTypes')}</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-800 px-2 text-sm text-gray-400">{t('imageUploader.or')}</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-center text-sm font-semibold text-gray-300 mb-4">{t('imageUploader.trySample')}</h3>
        <div className="grid grid-cols-3 gap-3">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleClick(sample)}
              disabled={!!loadingSample}
              className="relative aspect-w-16 aspect-h-10 rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:cursor-not-allowed"
            >
              <img
                src={sample.src}
                alt={t(sample.labelKey)}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${loadingSample && loadingSample !== sample.id ? 'opacity-50 grayscale' : ''} ${loadingSample === sample.id ? 'blur-sm' : ''}`}
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>
              <span className="absolute bottom-2 left-0 right-0 text-xs font-bold text-white text-center truncate px-1">
                {t(sample.labelKey)}
              </span>
              {loadingSample === sample.id && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader small />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};