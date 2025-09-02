import React from 'react';
import { useSound } from '../context/SoundContext';
import { VolumeUpIcon } from './icons/VolumeUpIcon';
import { VolumeOffIcon } from './icons/VolumeOffIcon';

export const SoundToggle: React.FC = () => {
  const { isSoundEnabled, toggleSound } = useSound();

  const handleToggle = () => {
    // We don't play a click sound when toggling sound off, but we do when toggling it on.
    if (!isSoundEnabled) {
       const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
       audio.play();
    }
    toggleSound();
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
      aria-label={isSoundEnabled ? "Mute sounds" : "Unmute sounds"}
    >
      {isSoundEnabled ? (
        <VolumeUpIcon className="w-5 h-5" />
      ) : (
        <VolumeOffIcon className="w-5 h-5" />
      )}
    </button>
  );
};
