
import { RemodelingType, DecorStyle, Material, Lighting, CustomItem, RemodelMode, RoomType } from '../types';

// La URL de tu backend. Para desarrollo local, será localhost.
// Cuando lo despliegues, tendrás que cambiarla por la URL de producción (ej: https://tu-backend.vercel.app)
const BACKEND_URL = 'https://virtual-remodel-ia-backend.vercel.app/'; 

interface MaterialSelections {
  wall: Material;
  floor: Material;
  ceiling: Material;
}

interface RemodelOptions {
  base64ImageData: string;
  mimeType: string;
  roomType: RoomType;
  lighting: Lighting;
  remodelMode: RemodelMode;
  // Style mode
  remodelingType?: RemodelingType;
  decorStyle?: DecorStyle;
  materials?: MaterialSelections;
  // Custom mode
  customItems?: CustomItem[];
  customPrompt?: string;
  // Inpainting mode
  inpaintingPrompt?: string;
  maskBase64Data?: string;
}

// Ya no necesitamos la función constructPrompt aquí, se ha movido al backend.
// Tampoco necesitamos getAiClient ni la inicialización de GoogleGenAI.

export const remodelImage = async (options: RemodelOptions): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/remodel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Enviamos todas las opciones al backend en el cuerpo de la petición.
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      // Si el backend devuelve un error, lo capturamos.
      const errorData = await response.json();
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.imageData) {
        throw new Error("Backend did not return image data.");
    }

    // El backend nos devuelve directamente la data de la imagen en base64.
    return result.imageData;

  } catch (error) {
    console.error("Error calling backend remodel service:", error);
    // Re-lanzamos el error para que el componente que llama (MainApp.tsx) pueda manejarlo.
    throw error;
  }
};
