
import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { RemodelControls } from './components/RemodelControls';
import { ImageDisplay } from './components/ImageDisplay';
import { Loader } from './components/Loader';
import { RemodelingType, DecorStyle, Material, Lighting, CustomItem, RemodelMode, RoomType } from './types';
import { remodelImage } from './services/geminiService';
import { DECOR_STYLES, MATERIALS, LIGHTING_OPTIONS, ROOM_TYPES } from './constants';
import { useTranslation } from './i18n/config';
import { useCustomLibrary } from './hooks/useCustomLibrary';
import ImageEditor, { ImageEditorRef } from './components/ImageEditor';
import { useAuth } from './hooks/useAuth';
import { addWatermark } from './utils';
import { useSound } from './context/SoundContext';

const MainApp: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Remodeling state
  const [roomType, setRoomType] = useState<RoomType>(ROOM_TYPES[6].value); // Default to Living Room
  const [remodelMode, setRemodelMode] = useState<RemodelMode>('style');
  const [remodelingType, setRemodelingType] = useState<RemodelingType>(RemodelingType.WithFurniture);
  const [decorStyle, setDecorStyle] = useState<DecorStyle>(DECOR_STYLES[0].value);
  const [lighting, setLighting] = useState<Lighting>(LIGHTING_OPTIONS[0].value);
  const [wallMaterial, setWallMaterial] = useState<Material>(MATERIALS[0].value);
  const [floorMaterial, setFloorMaterial] = useState<Material>(MATERIALS[3].value);
  const [ceilingMaterial, setCeilingMaterial] = useState<Material>(MATERIALS[0].value);

  // Custom library state
  const { library, addItem, removeItem } = useCustomLibrary();
  const [selectedCustomItemIds, setSelectedCustomItemIds] = useState<Set<string>>(new Set());
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  // Inpainting state
  const [inpaintingPrompt, setInpaintingPrompt] = useState<string>('');
  const [maskImage, setMaskImage] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState<number>(40);
  const imageEditorRef = useRef<ImageEditorRef>(null);

  const { t } = useTranslation();
  const { user, isDemo, deductCredit, openPricingModal } = useAuth();
  const { playClick, playSuccess, playDownload } = useSound();

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setGeneratedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
    setOriginalMimeType(file.type);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !originalMimeType) {
      setError("messages.errorUpload");
      return;
    }
     if (remodelMode === 'inpainting' && !maskImage) {
      setError("messages.errorMask");
      return;
    }
    if (!isDemo && user && user.credits <= 0) {
        setError("messages.errorNoCredits");
        openPricingModal();
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Data = originalImage.split(',')[1];
      
      let finalCustomItems: CustomItem[] = [];

      if (remodelMode === 'custom') {
        finalCustomItems = library.filter(item => selectedCustomItemIds.has(item.id));
      }

      const result = await remodelImage({
        base64ImageData: base64Data,
        mimeType: originalMimeType,
        roomType,
        lighting,
        remodelMode,
        // Style mode params
        remodelingType,
        decorStyle,
        materials: { wall: wallMaterial, floor: floorMaterial, ceiling: ceilingMaterial },
        // Custom mode params
        customItems: finalCustomItems,
        customPrompt,
        // Inpainting mode params
        inpaintingPrompt,
        maskBase64Data: maskImage,
      });

      let finalImage = `data:image/png;base64,${result}`;
      if (isDemo) {
        finalImage = await addWatermark(finalImage);
      }
      setGeneratedImage(finalImage);
      playSuccess();
      
      if (!isDemo) {
        deductCredit();
      }

      if (remodelMode === 'inpainting') {
        setRemodelMode('style');
      }
    } catch (e) {
      console.error(e);
      setError("messages.errorGenerate");
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, originalMimeType, roomType, remodelMode, remodelingType, decorStyle, wallMaterial, floorMaterial, ceilingMaterial, lighting, library, selectedCustomItemIds, customPrompt, inpaintingPrompt, maskImage, isDemo, playSuccess, user, deductCredit, openPricingModal]);

  const handleDownload = () => {
    if (!generatedImage) return;
    playDownload();
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'remodeled-room.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };
  
  const handleGenerateClick = () => {
    playClick();
    handleGenerate();
  }

  const handleResetClick = () => {
    playClick();
    handleReset();
  }

  const handleToggleCustomItem = (itemId: string) => {
    playClick();
    setSelectedCustomItemIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };
  
  const handleUndo = () => {
    playClick();
    imageEditorRef.current?.undo();
  }
  const handleClearMask = () => {
    playClick();
    imageEditorRef.current?.clear();
  }

  const hasNoCredits = !isDemo && user && user.credits <= 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 sticky top-28">
              <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">{t('controls.title')}</h2>
              {!originalImage ? (
                <ImageUploader onImageUpload={handleImageUpload} />
              ) : (
                <>
                  <RemodelControls
                    roomType={roomType}
                    setRoomType={setRoomType}
                    remodelingType={remodelingType}
                    setRemodelingType={setRemodelingType}
                    decorStyle={decorStyle}
                    setDecorStyle={setDecorStyle}
                    wallMaterial={wallMaterial}
                    setWallMaterial={setWallMaterial}
                    floorMaterial={floorMaterial}
                    setFloorMaterial={setFloorMaterial}
                    ceilingMaterial={ceilingMaterial}
                    setCeilingMaterial={setCeilingMaterial}
                    lighting={lighting}
                    setLighting={setLighting}
                    remodelMode={remodelMode}
                    setRemodelMode={setRemodelMode}
                    // Custom Uploads
                    customLibrary={library}
                    addCustomItem={addItem}
                    removeCustomItem={removeItem}
                    selectedCustomItemIds={selectedCustomItemIds}
                    onToggleCustomItem={handleToggleCustomItem}
                    customPrompt={customPrompt}
                    setCustomPrompt={setCustomPrompt}
                    // Inpainting
                    inpaintingPrompt={inpaintingPrompt}
                    setInpaintingPrompt={setInpaintingPrompt}
                    brushSize={brushSize}
                    setBrushSize={setBrushSize}
                    onUndo={handleUndo}
                    onClearMask={handleClearMask}
                  />
                  <div className="mt-8 space-y-4">
                    <button
                      onClick={handleGenerateClick}
                      disabled={isLoading || hasNoCredits}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center text-lg"
                    >
                      {isLoading ? (
                         <>
                          <Loader small />
                          <span className="ml-2">{t('actions.generating')}</span>
                         </>
                      ) : (
                        t('actions.generate')
                      )}
                    </button>
                    <button
                      onClick={handleResetClick}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 text-lg"
                    >
                      {t('actions.startOver')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Display Column */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 min-h-[60vh] flex flex-col items-center justify-center">
              {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg mb-4 w-full text-center">{t(error)}</div>}

              {isLoading && <Loader />}

              {!isLoading && !originalImage && (
                <div className="text-center text-gray-400">
                  <h3 className="text-2xl font-semibold">{t('messages.welcome')}</h3>
                  <p className="mt-2 max-w-md">{t('messages.uploadPrompt')}</p>
                </div>
              )}
              
              {!isLoading && originalImage && remodelMode !== 'inpainting' && (
                 <ImageDisplay 
                    originalImage={originalImage} 
                    generatedImage={generatedImage} 
                    onDownload={handleDownload}
                    isDemo={isDemo}
                />
              )}
               {!isLoading && originalImage && remodelMode === 'inpainting' && (
                 <ImageEditor 
                    ref={imageEditorRef}
                    originalImage={originalImage}
                    brushSize={brushSize}
                    onMaskChange={setMaskImage}
                 />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainApp;