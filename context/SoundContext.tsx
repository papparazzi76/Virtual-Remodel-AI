import React, { createContext, useState, useContext, useMemo, ReactNode, useCallback, useEffect } from 'react';
import { CLICK_SOUND, SUCCESS_SOUND, DOWNLOAD_SOUND } from '../assets/sounds';

const SOUND_ENABLED_KEY = 'virtualRemodelSoundEnabled';

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playClick: () => void;
  playSuccess: () => void;
  playDownload: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const useAudio = (soundUrl: string): [() => void] => {
  const audio = useMemo(() => typeof Audio !== 'undefined' ? new Audio(soundUrl) : null, [soundUrl]);
  
  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
  }, [audio]);
  
  return [play];
};

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
     try {
      const storedValue = window.localStorage.getItem(SOUND_ENABLED_KEY);
      return storedValue !== null ? JSON.parse(storedValue) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
        window.localStorage.setItem(SOUND_ENABLED_KEY, JSON.stringify(isSoundEnabled));
    } catch (e) {
        console.error("Could not save sound preference:", e);
    }
  }, [isSoundEnabled]);

  const [playClickSound] = useAudio(CLICK_SOUND);
  const [playSuccessSound] = useAudio(SUCCESS_SOUND);
  const [playDownloadSound] = useAudio(DOWNLOAD_SOUND);
  
  const playSoundIfEnabled = (player: () => void) => {
    if (isSoundEnabled) {
      player();
    }
  };
  
  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  const value = {
    isSoundEnabled,
    toggleSound,
    playClick: () => playSoundIfEnabled(playClickSound),
    playSuccess: () => playSoundIfEnabled(playSuccessSound),
    playDownload: () => playSoundIfEnabled(playDownloadSound),
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};