import { CustomItem, CustomItemCategory, PermanentItem } from './types';

// This file is intentionally left sparse after removing permanent library features.
// It can be used for future utility functions.

// FIX: Implement and export the missing 'permanentItemToCustomItem' utility function.
// This function is required by `PermanentLibrary.tsx` to convert a permanent library
// item into a custom item by fetching its image data and translating its name.
const imageUrlToDataUrl = async (url: string): Promise<{ dataUrl: string; mimeType: string }> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ dataUrl: reader.result as string, mimeType: blob.type || 'image/jpeg' });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const permanentItemToCustomItem = async (
  item: PermanentItem,
  t: (key: string) => string
): Promise<Pick<CustomItem, 'name' | 'category' | 'dataUrl' | 'mimeType'>> => {
  const { dataUrl, mimeType } = await imageUrlToDataUrl(item.src);
  return {
    name: t(item.labelKey),
    category: item.category,
    dataUrl,
    mimeType,
  };
};

export const addWatermark = (dataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Watermark styling
      const fontSize = Math.max(20, Math.min(canvas.width / 20, canvas.height / 15));
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const text = "DEMO - Virtual Remodel AI";
      
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;

      // Save context state
      ctx.save();

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 4); // Rotate by -45 degrees

      // Calculate the number of times to repeat the watermark
      const repeatX = Math.ceil(canvas.width / textWidth) + 6;
      const repeatY = Math.ceil(canvas.height / 100) + 6;

      for (let i = -Math.floor(repeatY / 2); i < Math.ceil(repeatY / 2); i++) {
        for (let j = -Math.floor(repeatX/2); j < Math.ceil(repeatX / 2); j++) {
           ctx.fillText(text, j * (textWidth + 100), i * 150);
        }
      }

      // Restore context state
      ctx.restore();

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
        // if there's an error loading the image (e.g. cors), return original
        resolve(dataUrl);
    }
    img.src = dataUrl;
  });
};
