
import React from 'react';
import { RemodelingType, DecorStyle, Material, Lighting, CustomItem, CustomItemCategory, RemodelMode, RoomType } from '../types';
import { DECOR_STYLES, MATERIALS, LIGHTING_OPTIONS, ROOM_TYPES } from '../constants';
import { useTranslation } from '../i18n/config';
import { CustomLibrary } from './CustomLibrary';
import { InpaintingControls } from './InpaintingControls';
import { useSound } from '../context/SoundContext';

interface RemodelControlsProps {
  roomType: RoomType;
  setRoomType: (type: RoomType) => void;
  remodelingType: RemodelingType;
  setRemodelingType: (type: RemodelingType) => void;
  decorStyle: DecorStyle;
  setDecorStyle: (style: DecorStyle) => void;
  wallMaterial: Material;
  setWallMaterial: (material: Material) => void;
  floorMaterial: Material;
  setFloorMaterial: (material: Material) => void;
  ceilingMaterial: Material;
  setCeilingMaterial: (material: Material) => void;
  lighting: Lighting;
  setLighting: (lighting: Lighting) => void;
  remodelMode: RemodelMode;
  setRemodelMode: (mode: RemodelMode) => void;
  // Custom Uploads
  customLibrary: CustomItem[];
  addCustomItem: (name: string, category: CustomItemCategory, dataUrl: string, mimeType: string) => void;
  removeCustomItem: (id: string) => void;
  selectedCustomItemIds: Set<string>;
  onToggleCustomItem: (id: string) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  // Inpainting
  inpaintingPrompt: string;
  setInpaintingPrompt: (prompt: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onUndo: () => void;
  onClearMask: () => void;
}

interface MaterialPickerProps {
  labelKey: string;
  materials: readonly { value: Material; labelKey: string }[];
  selectedMaterial: Material;
  onSelectMaterial: (material: Material) => void;
}

const MaterialPicker: React.FC<MaterialPickerProps> = ({ labelKey, materials, selectedMaterial, onSelectMaterial }) => {
  const { t } = useTranslation();
  const { playClick } = useSound();

  const handleSelect = (material: Material) => {
    playClick();
    onSelectMaterial(material);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {t(labelKey)}
      </label>
      <div className="flex flex-wrap gap-2">
        {materials.map((material) => (
          <button
            key={material.value}
            type="button"
            onClick={() => handleSelect(material.value)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
              selectedMaterial === material.value
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {t(material.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
};


export const RemodelControls: React.FC<RemodelControlsProps> = (props) => {
  const { t } = useTranslation();
  const { playClick } = useSound();
  const {
    roomType, setRoomType, remodelingType, setRemodelingType, decorStyle, setDecorStyle,
    wallMaterial, setWallMaterial, floorMaterial, setFloorMaterial,
    ceilingMaterial, setCeilingMaterial, lighting, setLighting,
    remodelMode, setRemodelMode, customLibrary, addCustomItem, removeCustomItem,
    selectedCustomItemIds, onToggleCustomItem, customPrompt, setCustomPrompt,
    inpaintingPrompt, setInpaintingPrompt, brushSize, setBrushSize, onUndo, onClearMask
  } = props;

  const handleModeChange = (mode: RemodelMode) => {
    playClick();
    setRemodelMode(mode);
  };

  const handleRemodelingTypeChange = (type: RemodelingType) => {
    playClick();
    setRemodelingType(type);
  };
  
  const handleLightingChange = (type: Lighting) => {
    playClick();
    setLighting(type);
  };
  
  const handleDecorStyleChange = (style: DecorStyle) => {
    playClick();
    setDecorStyle(style);
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('controls.mode')}</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleModeChange('style')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              remodelMode === 'style' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {t('controls.styleMode')}
          </button>
          <button
            onClick={() => handleModeChange('custom')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              remodelMode === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {t('controls.customMode')}
          </button>
           <button
            onClick={() => handleModeChange('inpainting')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              remodelMode === 'inpainting' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {t('controls.editMode')}
          </button>
        </div>
      </div>
      
      {remodelMode !== 'inpainting' && (
        <div>
          <label htmlFor="room-type-select" className="block text-sm font-medium text-gray-300 mb-2">{t('controls.roomType')}</label>
          <select 
            id="room-type-select"
            value={roomType} 
            onChange={e => setRoomType(e.target.value as RoomType)} 
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            {ROOM_TYPES.map(option => (
              <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
            ))}
          </select>
        </div>
      )}

      <div className="border-t border-gray-700 pt-6">
        {remodelMode === 'style' ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('controls.remodelingType')}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleRemodelingTypeChange(RemodelingType.WithFurniture)}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    remodelingType === RemodelingType.WithFurniture ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {t('controls.withFurniture')}
                </button>
                <button
                  onClick={() => handleRemodelingTypeChange(RemodelingType.WithoutFurniture)}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    remodelingType === RemodelingType.WithoutFurniture ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {t('controls.emptyRoom')}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('controls.lightingMood')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LIGHTING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleLightingChange(option.value)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 text-center ${
                      lighting === option.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {t(option.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {remodelingType === RemodelingType.WithFurniture && (
              <div key="with-furniture-controls">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('controls.decorStyle')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DECOR_STYLES.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => handleDecorStyleChange(style.value)}
                      className={`w-full text-center p-2 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 flex flex-col gap-2 ${
                        decorStyle === style.value
                          ? 'border-indigo-500 bg-indigo-900/30'
                          : 'border-gray-700 bg-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <img
                        src={style.visual}
                        alt={t(style.labelKey)}
                        className="w-full h-12 rounded-md object-cover"
                      />
                      <span className="text-xs font-semibold text-gray-200">{t(style.labelKey)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {remodelingType === RemodelingType.WithoutFurniture && (
              <div className="space-y-6 border-t border-gray-700 pt-6">
                  <MaterialPicker
                    labelKey="controls.wallMaterial"
                    materials={MATERIALS}
                    selectedMaterial={wallMaterial}
                    onSelectMaterial={setWallMaterial}
                  />
                  <MaterialPicker
                    labelKey="controls.floorMaterial"
                    materials={MATERIALS}
                    selectedMaterial={floorMaterial}
                    onSelectMaterial={setFloorMaterial}
                  />
                  <MaterialPicker
                    labelKey="controls.ceilingMaterial"
                    materials={MATERIALS}
                    selectedMaterial={ceilingMaterial}
                    onSelectMaterial={setCeilingMaterial}
                  />
                </div>
            )}

          </div>
        ) : remodelMode === 'custom' ? (
          <div className="space-y-6">
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('controls.lightingMood')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LIGHTING_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleLightingChange(option.value)}
                      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 text-center ${
                        lighting === option.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {t(option.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('controls.customPrompt')}
                </label>
                <textarea
                  id="custom-prompt"
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={t('controls.customPromptPlaceholder')}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                 <CustomLibrary
                    library={customLibrary}
                    addCustomItem={addCustomItem}
                    removeCustomItem={removeCustomItem}
                    selectedItemIds={selectedCustomItemIds}
                    onToggleItem={onToggleCustomItem}
                  />
              </div>
          </div>
        ) : (
             <InpaintingControls
                prompt={inpaintingPrompt}
                setPrompt={setInpaintingPrompt}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                onUndo={onUndo}
                onClear={onClearMask}
            />
        )}
      </div>
    </div>
  );
};