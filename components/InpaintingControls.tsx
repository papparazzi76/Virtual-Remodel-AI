
import React from 'react';
import { useTranslation } from '../i18n/config';
import { UndoIcon } from './icons/UndoIcon';
import { TrashIcon } from './icons/TrashIcon';

interface InpaintingControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onUndo: () => void;
  onClear: () => void;
}

export const InpaintingControls: React.FC<InpaintingControlsProps> = ({
  prompt,
  setPrompt,
  brushSize,
  setBrushSize,
  onUndo,
  onClear,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="inpainting-prompt" className="block text-sm font-medium text-gray-300 mb-2">
          {t('inpainting.prompt')}
        </label>
        <textarea
          id="inpainting-prompt"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('inpainting.prompt')}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="brush-size" className="block text-sm font-medium text-gray-300 mb-2">
          {t('inpainting.brushSize')}: {brushSize}
        </label>
        <input
          id="brush-size"
          type="range"
          min="5"
          max="100"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onUndo}
          className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-300"
        >
          <UndoIcon className="w-4 h-4" />
          {t('inpainting.undo')}
        </button>
        <button
          onClick={onClear}
          className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-300"
        >
          <TrashIcon className="w-4 h-4" />
          {t('inpainting.clearMask')}
        </button>
      </div>
    </div>
  );
};
