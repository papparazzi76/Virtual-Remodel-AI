import React, { useState, useMemo } from 'react';
import { PermanentItem, CustomItemCategory } from '../types';
import { useTranslation } from '../i18n/config';
import { PlusIcon } from './icons/PlusIcon';
import { permanentItemToCustomItem } from '../utils';
import { Loader } from './Loader';

interface PermanentLibraryProps {
  library: readonly PermanentItem[];
  selectedItemIds: Set<string>;
  onToggleItem: (id: string) => void;
  addCustomItem: (name: string, category: CustomItemCategory, dataUrl: string, mimeType: string) => void;
}

const CATEGORIES: CustomItemCategory[] = ['Wall Material', 'Floor Material', 'Door', 'Window', 'Furniture', 'Appliance'];


export const PermanentLibrary: React.FC<PermanentLibraryProps> = ({ library, selectedItemIds, onToggleItem, addCustomItem }) => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<CustomItemCategory | 'All'>('All');
  const [isAdding, setIsAdding] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return library.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = t(item.labelKey).toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [library, activeCategory, searchTerm, t]);

  const handleAddToCustom = async (item: PermanentItem) => {
    if (isAdding.has(item.id)) return;

    setIsAdding(prev => new Set(prev).add(item.id));
    try {
      const customItem = await permanentItemToCustomItem(item, t);
      addCustomItem(customItem.name, customItem.category, customItem.dataUrl, customItem.mimeType);
    } catch (error) {
      console.error(`Failed to add item ${item.id} to custom library:`, error);
    } finally {
      setIsAdding(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };


  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-200">{t('permanentLibrary.title')}</h3>
        <p className="text-xs text-gray-400">{t('permanentLibrary.description')}</p>
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
        {filteredItems.length === 0 ? (
           <p className="text-sm text-gray-500 text-center py-4">{t('search.noResults')}</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredItems.map(item => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onToggleItem(item.id)}
                  className={`w-full aspect-square rounded-md overflow-hidden focus:outline-none ring-2 ring-offset-2 ring-offset-gray-800 transition-all ${selectedItemIds.has(item.id) ? 'ring-indigo-500' : 'ring-transparent'}`}
                >
                  <img src={item.src} alt={t(item.labelKey)} crossOrigin="anonymous" className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 transition-colors ${selectedItemIds.has(item.id) ? 'bg-black/30' : 'bg-black/60 group-hover:bg-black/40'}`}></div>
                  <p className="absolute bottom-1 left-1 right-1 text-xs text-white font-semibold truncate text-center bg-black/50 px-1 rounded-sm">{t(item.labelKey)}</p>
                </button>
                <button
                  onClick={() => handleAddToCustom(item)}
                  disabled={isAdding.has(item.id)}
                  className="absolute top-1 right-1 flex items-center justify-center h-6 w-6 bg-indigo-600/80 hover:bg-indigo-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-400 disabled:bg-gray-600 disabled:cursor-wait"
                  aria-label={t('permanentLibrary.addToCustom')}
                  title={t('permanentLibrary.addToCustom')}
                >
                  {isAdding.has(item.id) ? (
                      <Loader small />
                  ) : (
                      <PlusIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};