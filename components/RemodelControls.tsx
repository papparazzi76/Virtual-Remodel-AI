import React, { useState, useCallback } from 'react';
import { 
  RemodelingType, DecorStyle, Material, Lighting, CustomItem, 
  CustomItemCategory, RemodelMode, RoomType, TilingPattern, AnchorPoint, 
  EdgeHandling, TargetSurface, MaterialFinish, TargetWall 
} from '../types';
import { DECOR_STYLES, MATERIALS, LIGHTING_OPTIONS, ROOM_TYPES } from '../constants';
import { useTranslation } from '../i18n/config';
import { CustomLibrary } from './CustomLibrary';
import { InpaintingControls } from './InpaintingControls';
import { useSound } from '../context/SoundContext';
import { UploadIcon } from './icons/UploadIcon';

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
  // Material Mode
  targetSurface: TargetSurface;
  setTargetSurface: (surface: TargetSurface) => void;
  materialFinish: MaterialFinish;
  setMaterialFinish: (finish: MaterialFinish) => void;
  targetWall: TargetWall;
  setTargetWall: (wall: TargetWall) => void;
  materialTexture: string | null;
  onMaterialTextureChange: (file: File) => void;
  pieceWidthCm: number;
  setPieceWidthCm: (width: number) => void;
  pieceHeightCm: number;
  setPieceHeightCm: (height: number) => void;
  groutThicknessMm: number;
  setGroutThicknessMm: (thickness: number) => void;
  groutColorHex: string;
  setGroutColorHex: (color: string) => void;
  tilingPattern: TilingPattern;
  setTilingPattern: (pattern: TilingPattern) => void;
  tilingOffsetPercent: number;
  setTilingOffsetPercent: (offset: number) => void;
  pieceOrientation: number;
  setPieceOrientation: (orientation: number) => void;
  anchorPoint: AnchorPoint;
  setAnchorPoint: (anchor: AnchorPoint) => void;
  edgeHandling: EdgeHandling;
  setEdgeHandling: (handling: EdgeHandling) => void;
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

const MaterialControls: React.FC<Pick<RemodelControlsProps, 'targetSurface'|'setTargetSurface'|'materialFinish'|'setMaterialFinish'|'targetWall'|'setTargetWall'|'materialTexture'|'onMaterialTextureChange'|'pieceWidthCm'|'setPieceWidthCm'|'pieceHeightCm'|'setPieceHeightCm'|'groutThicknessMm'|'setGroutThicknessMm'|'groutColorHex'|'setGroutColorHex'|'tilingPattern'|'setTilingPattern'|'tilingOffsetPercent'|'setTilingOffsetPercent'|'pieceOrientation'|'setPieceOrientation'|'anchorPoint'|'setAnchorPoint'|'edgeHandling'|'setEdgeHandling'>> = (props) => {
    const { t } = useTranslation();
    const { playClick } = useSound();
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        props.onMaterialTextureChange(e.target.files[0]);
      }
    };
     const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          props.onMaterialTextureChange(e.dataTransfer.files[0]);
        }
    }, [props.onMaterialTextureChange]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    
    return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('controls.targetSurface')}</label>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => props.setTargetSurface('Walls')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${props.targetSurface === 'Walls' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t('controls.walls')}</button>
                <button onClick={() => props.setTargetSurface('Floor')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${props.targetSurface === 'Floor' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t('controls.floor')}</button>
            </div>
          </div>

          {props.targetSurface === 'Walls' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('controls.targetWall')}</label>
              <div className="grid grid-cols-4 gap-2">
                {(['left', 'right', 'front', 'all'] as TargetWall[]).map(wall => (
                  <button key={wall} onClick={() => props.setTargetWall(wall)} className={`px-2 py-2 text-xs font-semibold rounded-md transition-colors duration-200 ${props.targetWall === wall ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t(`walls.${wall}`)}</button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('controls.materialFinish')}</label>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => props.setMaterialFinish('glossy')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${props.materialFinish === 'glossy' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t('controls.glossy')}</button>
                <button onClick={() => props.setMaterialFinish('matte')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${props.materialFinish === 'matte' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t('controls.matte')}</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('controls.materialTexture')}</label>
            <div
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-gray-700/50' : 'border-gray-600 hover:border-indigo-500'}`}
                onClick={() => document.getElementById('material-texture-upload')?.click()}
                onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            >
                <input id="material-texture-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                 {props.materialTexture ? (
                    <img src={props.materialTexture} alt="Texture Preview" className="max-h-24 mx-auto rounded-md" />
                ) : (
                    <div className="flex flex-col items-center">
                        <UploadIcon className="w-8 h-8 text-gray-500 mb-1" />
                        <p className="font-semibold text-xs text-gray-300">{t('customLibrary.uploadPrompt')}</p>
                    </div>
                )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('controls.pieceDimensions')}</label>
            <div className="grid grid-cols-2 gap-2">
                <input type="number" value={props.pieceWidthCm} onChange={e => props.setPieceWidthCm(Number(e.target.value))} placeholder={t('controls.pieceWidth')} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" />
                <input type="number" value={props.pieceHeightCm} onChange={e => props.setPieceHeightCm(Number(e.target.value))} placeholder={t('controls.pieceHeight')} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('controls.groutSettings')}</label>
            <div className="grid grid-cols-2 gap-2">
                <input type="number" value={props.groutThicknessMm} onChange={e => props.setGroutThicknessMm(Number(e.target.value))} placeholder={t('controls.grout')} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" />
                <input type="color" value={props.groutColorHex} onChange={e => props.setGroutColorHex(e.target.value)} title={t('controls.groutColor')} className="w-full h-10 bg-gray-700 border border-gray-600 rounded-md cursor-pointer" />
            </div>
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('controls.tilingPattern')}</label>
              <div className="grid grid-cols-2 gap-2">
                  {(['grid', 'brick_50', 'brick_custom', 'diagonal_45'] as TilingPattern[]).map(p => 
                    <button key={p} onClick={() => props.setTilingPattern(p)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${props.tilingPattern === p ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t(`tilingPatterns.${p}`)}</button>
                  )}
              </div>
          </div>

          {props.tilingPattern === 'brick_custom' && (
              <div>
                  <label htmlFor="offset" className="block text-sm font-medium text-gray-300 mb-2">{t('controls.tilingOffset')} {props.tilingOffsetPercent}%</label>
                  <input id="offset" type="range" min="0" max="100" value={props.tilingOffsetPercent} onChange={e => props.setTilingOffsetPercent(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
              </div>
          )}
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
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleModeChange('style')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors duration-200 ${
              remodelMode === 'style' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {t('controls.styleMode')}
          </button>
          <button
            onClick={() => handleModeChange('custom')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors duration-200 ${
              remodelMode === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {t('controls.customMode')}
          </button>
           <button
            onClick={() => handleModeChange('material')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors duration-200 ${
              remodelMode === 'material' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {t('controls.materialMode')}
          </button>
           <button
            onClick={() => handleModeChange('inpainting')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors duration-200 ${
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
        ) : remodelMode === 'material' ? (
            <MaterialControls {...props} />
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