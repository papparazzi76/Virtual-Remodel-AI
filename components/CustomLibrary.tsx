

import React, { useState, useCallback, useMemo } from 'react';
import { CustomItem, CustomItemCategory } from '../types';
import { useTranslation } from '../i18n/config';
import { PlusIcon } from './icons/PlusIcon';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface CustomLibraryProps {
  library: CustomItem[];
  addCustomItem: (name: string, category: CustomItemCategory, dataUrl: string, mimeType: string) => void;
  removeCustomItem: (id: string) => void;
  selectedItemIds: Set<string>;
  onToggleItem: (id: string) => void;
}

const CATEGORIES: CustomItemCategory[] = ['Wall Material', 'Floor Material', 'Door', 'Window', 'Furniture', 'Appliance'];

export const CustomLibrary: React.FC<CustomLibraryProps> = ({ library, addCustomItem, removeCustomItem, selectedItemIds, onToggleItem }) => {
  const { t } = useTranslation();
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CustomItemCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Uploader State ---
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<CustomItemCategory>('Wall Material');
  const [newItemFile, setNewItemFile] = useState<File | null>(null);
  const [newItemPreview, setNewItemPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const resetUploaderForm = useCallback(() => {
    setNewItemName('');
    setNewItemCategory('Wall Material');
    setNewItemFile(null);
    setNewItemPreview(null);
    setIsDragging(false);
  }, []);
  
  const handleToggleUploader = () => {
    const willBeOpen = !isUploaderOpen;
    setIsUploaderOpen(willBeOpen);
    if (!willBeOpen) {
      resetUploaderForm();
    }
  };

  const handleCancelUpload = () => {
    setIsUploaderOpen(false);
    resetUploaderForm();
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setNewItemFile(selectedFile);
      setNewItemName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName && newItemCategory && newItemFile && newItemPreview) {
      const mimeTypeMatch = newItemPreview.match(/^data:(.*);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : newItemFile.type;
      addCustomItem(newItemName, newItemCategory, newItemPreview, mimeType);
      
      setIsUploaderOpen(false);
      resetUploaderForm();
    }
  };

  const categorizedItems = useMemo(() => {
    return library.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<CustomItemCategory, CustomItem[]>);
  }, [library]);

  const categoriesToDisplay = useMemo(() => 
    activeCategory === 'All' ? CATEGORIES : [activeCategory], 
    [activeCategory]
  );

  const hasVisibleItems = useMemo(() => 
    categoriesToDisplay.some(cat => 
      categorizedItems[cat]?.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    [categoriesToDisplay, categorizedItems, searchTerm]
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-200">{t('customLibrary.title')}</h3>
        <p className="text-xs text-gray-400">{t('customLibrary.description')}</p>
      </div>

      <input
        type="text"
        placeholder={t('search.placeholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:ring-indigo-500 focus:border-indigo-500"
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${activeCategory === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {t('tabs.all')}
        </button>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${activeCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {t(`customLibrary.${category.toLowerCase().replace(/ /g, '')}`)}
          </button>
        ))}
      </div>

      <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
        {library.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">{t('customLibrary.empty')}</p>
        ) : !hasVisibleItems ? (
          <p className="text-sm text-gray-500 text-center py-4">{t('search.noResults')}</p>
        ) : (
          categoriesToDisplay.map(category => {
            const itemsToDisplay = categorizedItems[category]?.filter(item => 
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (!itemsToDisplay || itemsToDisplay.length === 0) {
              return null;
            }
            
            return (
              <div key={category}>
                {activeCategory === 'All' && (
                  <h4 className="text-sm font-semibold text-indigo-400 mb-2">{t(`customLibrary.${category.toLowerCase().replace(/ /g, '')}`)}</h4>
                )}
                <div className="grid grid-cols-3 gap-2">
                  {itemsToDisplay.map(item => (
                    <div key={item.id} className="relative group">
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className={`w-full aspect-square rounded-md overflow-hidden group focus:outline-none ring-2 ring-offset-2 ring-offset-gray-800 transition-all ${selectedItemIds.has(item.id) ? 'ring-indigo-500' : 'ring-transparent'}`}
                      >
                        <img src={item.dataUrl} alt={item.name} className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 transition-colors ${selectedItemIds.has(item.id) ? 'bg-black/30' : 'bg-black/60 group-hover:bg-black/40'}`}></div>
                        <p className="absolute bottom-1 left-1 right-1 text-xs text-white font-semibold truncate text-center bg-black/50 px-1 rounded-sm">{item.name}</p>
                      </button>
                      <button onClick={() => removeCustomItem(item.id)} className="absolute top-1 right-1 p-0.5 bg-red-800/80 hover:bg-red-700 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
       <button 
        onClick={handleToggleUploader}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-semibold rounded-lg transition-colors duration-300"
      >
        <PlusIcon className="w-5 h-5" />
        {t('customLibrary.addItem')}
      </button>

      {isUploaderOpen && (
        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
          <h3 className="text-lg font-bold mb-4">{t('customLibrary.addItem')}</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-gray-700/50' : 'border-gray-600 hover:border-indigo-500'}`}
              onClick={() => document.getElementById('item-upload')?.click()}
              onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            >
              <input id="item-upload" type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e.target.files?.[0] ?? null)} />
              {newItemPreview ? (
                <img src={newItemPreview} alt="Preview" className="max-h-32 mx-auto rounded-md" />
              ) : (
                <div className="flex flex-col items-center">
                  <UploadIcon className="w-10 h-10 text-gray-500 mb-2" />
                  <p className="font-semibold text-sm text-gray-300">{isDragging ? t('customLibrary.dropHere') : t('customLibrary.uploadPrompt')}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('imageUploader.fileTypes')}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="item-name" className="block text-sm font-medium text-gray-300 mb-1">{t('customLibrary.itemName')}</label>
              <input type="text" id="item-name" value={newItemName} onChange={e => setNewItemName(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="item-category" className="block text-sm font-medium text-gray-300 mb-1">{t('customLibrary.category')}</label>
              <select id="item-category" value={newItemCategory} onChange={e => setNewItemCategory(e.target.value as CustomItemCategory)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{t(`customLibrary.${cat.toLowerCase().replace(/ /g, '')}`)}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={handleCancelUpload} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm font-semibold">{t('customLibrary.cancel')}</button>
              <button type="submit" disabled={!newItemName || !newItemFile} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-semibold disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed">{t('customLibrary.add')}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};